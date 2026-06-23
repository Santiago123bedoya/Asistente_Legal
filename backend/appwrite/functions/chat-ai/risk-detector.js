// backend/appwrite/functions/chat-ai/risk-detector.js
// ⚠️ Detección de riesgos legales

const { LLMService } = require('../../../ai-services/llm');

class RiskDetector {
  constructor() {
    this.llmService = new LLMService();
    this.riskLevels = {
      CRITICAL: 'CRITICAL',
      HIGH: 'HIGH',
      MEDIUM: 'MEDIUM',
      LOW: 'LOW',
      NONE: 'NONE'
    };
  }

  async analyze({ question, response, context }) {
    try {
      console.log('⚠️ Analizando riesgos legales...');

      const result = await this.llmService.detectRisks({
        question,
        response,
        context
      });

      // Validar y normalizar resultado
      return {
        has_risk: result.has_risk || false,
        level: result.level || this.riskLevels.NONE,
        description: result.description || 'Sin riesgo detectado',
        recommendations: result.recommendations || 'Mantener monitoreo regular',
        raw: result
      };

    } catch (error) {
      console.error('❌ Error en risk detection:', error);
      return {
        has_risk: false,
        level: 'NONE',
        description: 'No se pudo determinar',
        recommendations: 'Revisar manualmente'
      };
    }
  }

  // Analiza riesgos específicos por categoría
  analyzeCategory(question, category) {
    const riskPatterns = {
      'GOBIERNO_COOPERATIVO': [
        'falta de quórum',
        'irregularidades en asamblea',
        'conflicto de intereses',
        'incumplimiento de estatutos'
      ],
      'DERECHOS_ASOCIADOS': [
        'violación de derechos',
        'discriminación',
        'exclusión indebida',
        'falta de transparencia'
      ],
      'FINANZAS': [
        'irregularidades contables',
        'fraude financiero',
        'malversación de fondos',
        'incumplimiento fiscal'
      ],
      'DATOS': [
        'violación de privacidad',
        'fuga de datos',
        'incumplimiento de protección de datos'
      ],
      'LABORAL': [
        'acoso laboral',
        'incumplimiento de derechos laborales',
        'contratación irregular'
      ]
    };

    const patterns = riskPatterns[category] || [];
    const detected = patterns.filter(p => 
      question.toLowerCase().includes(p.toLowerCase())
    );

    return {
      detected: detected.length > 0,
      patterns: detected,
      level: detected.length > 2 ? 'HIGH' : detected.length > 0 ? 'MEDIUM' : 'LOW'
    };
  }
}

module.exports = { RiskDetector };