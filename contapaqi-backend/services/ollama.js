// services/ollama.js
const axios = require('axios');
const crypto = require('crypto');
const { generateSpecializedPrompt, PROMPT_CATEGORIES } = require('../utils/promptLibrary');
const { createService } = require('../gateway');

(async () => {
  // 1) Levantamos el microservicio Ollama en el puerto 3007
  const { app } = await createService(3007, 'Ollama');

  // 2) Configuración del API de Ollama y cache en memoria
  const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
  const responseCache = new Map();
  const CACHE_TTL = 24 * 60 * 60 * 1000;
  const MAX_CACHE_SIZE = 100;

  function generateCacheKey(message) {
    return crypto.createHash('md5').update(message).digest('hex');
  }

  function cleanupCache() {
    if (responseCache.size > MAX_CACHE_SIZE) {
      const entries = [...responseCache.entries()];
      entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
      const deleteCount = Math.ceil(responseCache.size * 0.2);
      for (let i = 0; i < deleteCount; i++) {
        responseCache.delete(entries[i][0]);
      }
      console.log(`Cache limpiada: eliminadas ${deleteCount} entradas antiguas.`);
    }
  }

  function enhancePromptForAccounting(message) {
    return `Como asistente experto en contabilidad y finanzas de ContaPi, responde a la siguiente consulta:

${message}

Proporciona una respuesta precisa, didáctica y profesional. Si la pregunta está relacionada con términos contables, principios o normativas, menciona las normativas relevantes (como NIF, IFRS, etc.) cuando sea apropiado.

Si la consulta no está relacionada con contabilidad, finanzas o impuestos, responde cortésmente que estás especializado en esos temas y ofrece ayuda en esas áreas.

Usa un lenguaje claro y apropiado para profesionales de contabilidad, pero evita jerga excesiva si no es necesaria.`;
  }

  // 3) Endpoints de Ollama

  // Chat
  app.post('/chat', async (req, res) => {
    try {
      const { message, category = 'general' } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          error: 'Formato de mensaje inválido',
          message: 'El mensaje debe ser una cadena de texto'
        });
      }

      const validCategory = PROMPT_CATEGORIES.includes(category) ? category : 'general';
      const cacheKey = generateCacheKey(`${validCategory}:${message}`);
      if (responseCache.has(cacheKey)) {
        const cached = responseCache.get(cacheKey);
        cached.lastAccess = Date.now();
        console.log(`Respuesta obtenida de caché (${validCategory}) para: "${message.slice(0,30)}..."`);
        return res.json({ response: cached.response, fromCache: true, category: validCategory });
      }

      console.log(`Procesando consulta (${validCategory}) para Ollama: "${message.slice(0,50)}..."`);
      const specializedPrompt = generateSpecializedPrompt(message, validCategory);

      const apiRes = await axios.post(
        OLLAMA_API_URL,
        { model: 'llama3.2', prompt: specializedPrompt, stream: false },
        { timeout: 120000 }
      );

      const ollamaResponse = apiRes.data.response;
      responseCache.set(cacheKey, {
        response: ollamaResponse,
        timestamp: Date.now(),
        lastAccess: Date.now(),
        category: validCategory
      });
      cleanupCache();

      console.log(`Respuesta recibida de Ollama: ${ollamaResponse.slice(0,50)}...`);
      res.json({ response: ollamaResponse, fromCache: false, category: validCategory });
    } catch (error) {
      console.error('Error al comunicarse con Ollama:', error);
      if (error.response) {
        return res.status(error.response.status).json({
          error: 'Error en el servicio de Ollama',
          details: error.response.data
        });
      } else if (error.request) {
        return res.status(503).json({
          error: 'No se pudo conectar con el servicio de Ollama',
          message: 'Asegúrate de que Ollama esté en ejecución'
        });
      }
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  });

  // Categorías
  app.get('/categories', (req, res) => {
    res.json({ categories: PROMPT_CATEGORIES });
  });

  // Estado
  app.get('/status', async (req, res) => {
    try {
      await axios.get('http://localhost:11434/api/tags');
      res.json({ status: 'online', message: 'Servicio de Ollama disponible' });
    } catch {
      res.status(503).json({ status: 'offline', message: 'Servicio de Ollama no disponible' });
    }
  });

  // Limpiar caché
  app.delete('/cache', (req, res) => {
    const prev = responseCache.size;
    responseCache.clear();
    res.json({ message: `Caché limpiada. Se eliminaron ${prev} entradas.` });
  });

  // Stats de caché
  app.get('/cache/stats', (req, res) => {
    res.json({
      totalEntries: responseCache.size,
      maxSize: MAX_CACHE_SIZE,
      cacheAgeHours: CACHE_TTL / 3600000
    });
  });

  // Limpieza periódica
  setInterval(() => {
    const now = Date.now();
    let expired = 0;
    for (const [key, val] of responseCache.entries()) {
      if (now - val.timestamp > CACHE_TTL) {
        responseCache.delete(key);
        expired++;
      }
    }
    if (expired) {
      console.log(`Limpieza programada de caché: se eliminaron ${expired} entradas.`); 
    }
  }, 6 * 60 * 60 * 1000);

})();
