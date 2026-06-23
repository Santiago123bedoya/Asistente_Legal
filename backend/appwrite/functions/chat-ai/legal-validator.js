// backend/appwrite/functions/chat-ai/legal-validator.js
// ✅ Validación de precisión legal

const { LLMService } = require('../../../ai-services/llm');

class LegalValidator {
  constructor() {
    this.llmService = new LLMService();
  }

  async validate({ question, response, sources }) {
    try {
      console.log('✅ Validando precisión legal...');

      // 1. Verificar si hay fuentes
      const hasSources = sources && sources.length > 0;

      // 2. Verificar si la respuesta cita fuentes
      const hasCitations = response.includes('Fuente') || 
                          response.includes('según') ||
                          response.includes('de acuerdo con');

      // 3. Usar LLM para validación más profunda
      const validationResult = await this.llmService.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `Eres un validador de precisión legal para respuestas de IA en derecho cooperativo.
            Evalúa si la respuesta es precisa, tiene fuentes confiables y no contiene información errónea.

            Responde en formato JSON:
            {
              "status": "validated|needs_review|invalid",
              "confidence": 0.0-1.0,
              "warnings": ["warning1", "warning2"],
              "recommendations": "recomendación"
            }`
          },
          {
            role: 'user',
            content: `Consulta: ${question}\n\nRespuesta: ${response}\n\nFuentes: ${JSON.stringify(sources)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(validationResult.choices[0].message.content);

      // Añadir validaciones básicas
      const warnings = result.warnings || [];
      
      if (!hasSources) {
        warnings.push('La respuesta no tiene fuentes citadas');
      }
      
      if (!hasCitations) {
        warnings.push('La respuesta no referencia fuentes específicas');
      }

      if (response.length < 50) {
        warnings.push('La respuesta es muy corta, podría faltar información');
      }

      return {
        status: warnings.length > 2 ? 'needs_review' : result.status || 'validated',
        confidence: result.confidence || 0.7,
        warnings: warnings,
        recommendations: result.recommendations || 'Revisar con asesor humano'
      };

    } catch (error) {
      console.error('❌ Error en validación legal:', error);
      return {
        status: 'needs_review',
        confidence: 0.5,
        warnings: ['No se pudo validar automáticamente'],
        recommendations: 'Revisar con asesor humano'
      };
    }
  }

  // Validación de citas legales
  validateCitations(text) {
    const legalCitationPatterns = [
      /ley\s+\d+/gi,
      /artículo\s+\d+/gi,
      /sentencia\s+\d+/gi,
      /decreto\s+\d+/gi,
      /resolución\s+\d+/gi,
      /norma\s+\d+/gi
    ];

    const foundCitations = [];
    for (const pattern of legalCitationPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        foundCitations.push(...matches);
      }
    }

    return {
      hasCitations: foundCitations.length > 0,
      citations: foundCitations,
      count: foundCitations.length
    };
  }
}

module.exports = { LegalValidator };