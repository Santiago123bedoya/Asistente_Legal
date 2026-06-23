// backend/ai-services/llm/legal-prompts.js
// ⚖️ Prompts legales específicos para DeepSeek

const legalPrompts = {
  // Análisis de control democrático
  democraticControl: (question, context) => `
    Contexto legal sobre control democrático:
    ${context}
    
    Consulta: ${question}
    
    Por favor, analiza:
    1. Requisitos legales para mantener control democrático
    2. Posibles riesgos de incumplimiento
    3. Recomendaciones prácticas para el consejo directivo
  `,

  // Análisis de externalización
  outsourcingAnalysis: (question, context) => `
    Contexto legal sobre externalización:
    ${context}
    
    Consulta: ${question}
    
    Analiza:
    1. Límites legales para externalizar funciones
    2. Funciones que no pueden externalizarse
    3. Requisitos de supervisión y control
    4. Riesgos y responsabilidades
  `,

  // Análisis de protección de datos
  dataProtection: (question, context) => `
    Contexto legal sobre protección de datos:
    ${context}
    
    Consulta: ${question}
    
    Analiza:
    1. Obligaciones de la cooperativa como responsable de datos
    2. Derechos de los asociados sobre sus datos
    3. Medidas de seguridad requeridas
    4. Procedimientos en caso de violación de datos
  `,

  // Análisis de fusiones
  mergerAnalysis: (question, context) => `
    Contexto legal sobre fusiones cooperativas:
    ${context}
    
    Consulta: ${question}
    
    Analiza:
    1. Requisitos legales para fusión
    2. Procedimiento a seguir
    3. Derechos de los asociados en fusión
    4. Aspectos fiscales y laborales
  `,

  // Análisis general
  generalLegal: (question, context) => `
    Contexto legal proporcionado:
    ${context}
    
    Consulta: ${question}
    
    Por favor, proporciona:
    1. Un análisis legal claro y preciso
    2. Referencias a las fuentes utilizadas
    3. Identificación de riesgos
    4. Recomendaciones prácticas
    5. Indicación clara si necesitas consultar con un abogado humano
  `
};

module.exports = { legalPrompts };