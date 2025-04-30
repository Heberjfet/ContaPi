/**
 * Biblioteca de prompts especializados para consultas contables
 */

// Prompts base para diferentes categorías
const PROMPT_TEMPLATES = {
  impuestos: `Como especialista tributario, responde a la siguiente consulta sobre impuestos:

{{QUERY}}

Incluye, cuando sea relevante:
- Referencias a leyes fiscales aplicables
- Plazos de cumplimiento
- Cálculos básicos si son solicitados
- Consideraciones especiales para Personas Físicas vs Morales

Si hay ambigüedades, menciónalas y sugiere verificar con un contador público certificado.`,

  contabilidad: `Como contador experto, responde a la siguiente consulta contable:

{{QUERY}}

Basa tu respuesta en principios contables generalmente aceptados y:
- Menciona las NIF (Normas de Información Financiera) relevantes
- Explica los asientos contables si aplican
- Clarifica términos técnicos
- Considera implicaciones financieras y fiscales`,

  normativa: `Como experto en normativa contable, responde a la siguiente consulta:

{{QUERY}}

En tu respuesta:
- Cita las normativas específicas (NIF, IFRS/NIIF, etc.)
- Explica su aplicación práctica
- Menciona cambios recientes en la normativa si son relevantes
- Considera implicaciones para reportes financieros`,

  finanzas: `Como asesor financiero, responde a la siguiente consulta sobre finanzas:

{{QUERY}}

Incluye en tu análisis:
- Principios financieros aplicables
- Consideraciones de riesgo y rendimiento
- Implicaciones para la toma de decisiones
- Relación con reportes contables cuando sea relevante`,

  general: `Como asistente experto en contabilidad y finanzas de ContaPi, responde a la siguiente consulta:

{{QUERY}}

Proporciona una respuesta precisa, didáctica y profesional. Si es necesario, menciona:
- Conceptos básicos relevantes
- Principios contables o financieros aplicables
- Referencias a normativas cuando sea apropiado

Si la consulta no está relacionada con contabilidad, finanzas o impuestos, responde cortésmente que estás especializado en esos temas.`
};

/**
 * Genera un prompt especializado según la categoría y consulta
 * @param {string} query - La consulta del usuario
 * @param {string} category - Categoría de consulta (impuestos, contabilidad, etc.)
 * @returns {string} - Prompt optimizado para la categoría
 */
function generateSpecializedPrompt(query, category = 'general') {
  // Validar que la categoría existe, si no, usar general
  const template = PROMPT_TEMPLATES[category] || PROMPT_TEMPLATES.general;
  
  // Reemplazar el marcador de posición con la consulta
  return template.replace('{{QUERY}}', query);
}

module.exports = {
  generateSpecializedPrompt,
  PROMPT_CATEGORIES: Object.keys(PROMPT_TEMPLATES)
};