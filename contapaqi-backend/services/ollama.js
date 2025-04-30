const axios = require('axios');
const { createService } = require('../gateway');
const crypto = require('crypto');
const { generateSpecializedPrompt, PROMPT_CATEGORIES } = require('../utils/promptLibrary');

// Crear el microservicio Ollama en el puerto 3007
const { app, db } = createService(3007, 'Ollama');

// Configuración del servicio Ollama
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

// Sistema de caché en memoria
const responseCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas de TTL (Time To Live)
const MAX_CACHE_SIZE = 100; // Máximo número de entradas en caché

// Función para generar una clave de caché a partir del mensaje
function generateCacheKey(message) {
  return crypto.createHash('md5').update(message).digest('hex');
}

// Función para limpiar la caché si supera el tamaño máximo
function cleanupCache() {
  if (responseCache.size > MAX_CACHE_SIZE) {
    // Convertir el Map a un array, ordenar por tiempo de acceso y eliminar los más antiguos
    const entries = [...responseCache.entries()];
    entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    
    // Eliminar el 20% más antiguo
    const deleteCount = Math.ceil(responseCache.size * 0.2);
    for (let i = 0; i < deleteCount; i++) {
      if (entries[i]) {
        responseCache.delete(entries[i][0]);
      }
    }
    
    console.log(`Cache limpiada: eliminadas ${deleteCount} entradas antiguas.`);
  }
}

// Función para mejorar prompts con contexto contable
function enhancePromptForAccounting(message) {
  return `Como asistente experto en contabilidad y finanzas de ContaPi, responde a la siguiente consulta:

${message}

Proporciona una respuesta precisa, didáctica y profesional. Si la pregunta está relacionada con términos contables, principios o normativas, menciona las normativas relevantes (como NIF, IFRS, etc.) cuando sea apropiado.

Si la consulta no está relacionada con contabilidad, finanzas o impuestos, responde cortésmente que estás especializado en esos temas y ofrece ayuda en esas áreas.

Usa un lenguaje claro y apropiado para profesionales de contabilidad, pero evita jerga excesiva si no es necesaria.`;
}

// Endpoint para el chat con Ollama
app.post('/chat', async (req, res) => {
  try {
    const { message, category = 'general' } = req.body;
    
    // Validar la entrada
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Formato de mensaje inválido',
        message: 'El mensaje debe ser una cadena de texto'
      });
    }

    // Validar categoría
    const validCategory = PROMPT_CATEGORIES.includes(category) ? category : 'general';

    // Crear clave de caché que incluya la categoría
    const cacheKey = generateCacheKey(`${validCategory}:${message}`);
    if (responseCache.has(cacheKey)) {
      const cachedData = responseCache.get(cacheKey);
      
      // Actualizar el tiempo de último acceso
      cachedData.lastAccess = Date.now();
      responseCache.set(cacheKey, cachedData);
      
      console.log(`Respuesta obtenida de caché (${validCategory}) para: "${message.substring(0, 30)}..."`);
      return res.json({
        response: cachedData.response,
        fromCache: true,
        category: validCategory
      });
    }

    console.log(`Procesando consulta (${validCategory}) para Ollama: "${message.substring(0, 50)}..."`);

    // Generar prompt especializado según la categoría
    const specializedPrompt = generateSpecializedPrompt(message, validCategory);

    // Petición a la API de Ollama
    const response = await axios.post(OLLAMA_API_URL, {
      model: 'llama3.2',
      prompt: specializedPrompt,
      stream: false
    }, {
      timeout: 120000
    });

    // Guardar en caché
    const ollamaResponse = response.data.response;
    responseCache.set(cacheKey, {
      response: ollamaResponse,
      timestamp: Date.now(),
      lastAccess: Date.now(),
      category: validCategory
    });
    
    // Limpiar caché si supera el tamaño máximo
    cleanupCache();

    console.log(`Respuesta recibida de Ollama: ${ollamaResponse.substring(0, 50)}...`);

    // Respuesta al cliente
    res.json({
      response: ollamaResponse,
      fromCache: false,
      category: validCategory
    });
    
  } catch (error) {
    console.error('Error al comunicarse con Ollama:', error);
    
    // Manejo de errores específicos
    if (error.response) {
      // El servidor de Ollama respondió con un error
      return res.status(error.response.status).json({
        error: 'Error en el servicio de Ollama',
        details: error.response.data
      });
    } else if (error.request) {
      // No se pudo conectar con Ollama
      return res.status(503).json({
        error: 'No se pudo conectar con el servicio de Ollama',
        message: 'Asegúrate de que Ollama esté en ejecución'
      });
    }
    
    // Error general
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// Endpoint para obtener las categorías disponibles
app.get('/categories', (req, res) => {
  res.json({
    categories: PROMPT_CATEGORIES
  });
});

// Ruta para verificar el estado del servicio de Ollama
app.get('/status', async (req, res) => {
  try {
    // Intenta una petición sencilla a Ollama para verificar si está disponible
    await axios.get('http://localhost:11434/api/tags');
    res.json({ status: 'online', message: 'Servicio de Ollama disponible' });
  } catch (error) {
    res.status(503).json({ 
      status: 'offline', 
      message: 'Servicio de Ollama no disponible'
    });
  }
});

// Endpoint para limpiar la caché (para administradores)
app.delete('/cache', (req, res) => {
  const previousSize = responseCache.size;
  responseCache.clear();
  res.json({
    message: `Caché limpiada exitosamente. Se eliminaron ${previousSize} entradas.`
  });
});

// Endpoint para obtener estadísticas de la caché
app.get('/cache/stats', (req, res) => {
  res.json({
    totalEntries: responseCache.size,
    maxSize: MAX_CACHE_SIZE,
    cacheAgeHours: CACHE_TTL / (1000 * 60 * 60)
  });
});

// Tarea programada para limpiar entradas antiguas de la caché cada 6 horas
setInterval(() => {
  const now = Date.now();
  let expiredCount = 0;
  
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      responseCache.delete(key);
      expiredCount++;
    }
  }
  
  if (expiredCount > 0) {
    console.log(`Limpieza programada de caché: eliminadas ${expiredCount} entradas caducadas.`);
  }
}, 6 * 60 * 60 * 1000); // Cada 6 horas