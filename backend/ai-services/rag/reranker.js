// backend/ai-services/rag/reranker.js
// 📊 Re-ranking de documentos

const { LLMService } = require('../llm');

class Reranker {
  constructor() {
    this.llmService = new LLMService();
  }

  async rerank(question, documents) {
    if (!documents || documents.length === 0) return [];
    if (documents.length === 1) return [{ ...documents[0], relevance: 1 }];

    try {
      return await this.llmService.rerankDocuments(question, documents);
    } catch (error) {
      console.error('Error en rerank:', error);
      return documents.map((doc, i) => ({
        ...doc,
        relevance: 1 - (i / documents.length)
      }));
    }
  }

  // Re-ranking por categoría de consulta
  async rerankByCategory(question, documents, category) {
    const categoryWeights = {
      'GOBIERNO_COOPERATIVO': ['gobierno', 'directivo', 'asamblea', 'control', 'democrático'],
      'DERECHOS_ASOCIADOS': ['derechos', 'asociado', 'participación', 'voto'],
      'FINANZAS': ['finanzas', 'contabilidad', 'auditoría', 'fiscal'],
      'FUSION': ['fusión', 'incorporación', 'reestructuración'],
      'DATOS': ['datos', 'privacidad', 'protección', 'personal'],
      'LABORAL': ['laboral', 'trabajo', 'contratación', 'empleado'],
      'ESTATUTOS': ['estatuto', 'reglamento', 'reforma'],
      'RESPONSABILIDAD': ['responsabilidad', 'riesgo', 'legal', 'sanción']
    };

    const keywords = categoryWeights[category] || [];
    if (keywords.length === 0) return documents;

    const reranked = documents.map(doc => {
      const content = (doc.title + ' ' + doc.content).toLowerCase();
      let score = 0;
      
      for (const keyword of keywords) {
        if (content.includes(keyword)) {
          score += 0.2;
        }
      }

      return {
        ...doc,
        relevance: Math.min(1, (doc.relevance || 0.5) + score)
      };
    });

    return reranked.sort((a, b) => b.relevance - a.relevance);
  }
}

module.exports = { Reranker };