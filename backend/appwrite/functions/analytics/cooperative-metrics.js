// backend/appwrite/functions/analytics/cooperative-metrics.js
// 📈 Métricas específicas para cooperativas

const { Client, Databases } = require('node-appwrite');

class CooperativeMetrics {
  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    this.databases = new Databases(this.client);
    this.databaseId = process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db';
  }

  async getCooperativeMetrics(cooperativeId) {
    try {
      // Obtener información de la cooperativa
      const cooperative = await this.databases.getDocument(
        this.databaseId,
        'cooperatives',
        cooperativeId
      );

      // Obtener usuarios de la cooperativa
      const users = await this.databases.listDocuments(
        this.databaseId,
        'users',
        [`cooperative == "${cooperativeId}"`]
      );

      // Obtener consultas de la cooperativa
      const queries = await this.databases.listDocuments(
        this.databaseId,
        'chat_history',
        [
          `userId in ["${users.documents.map(u => u.$id).join('", "')}"]`
        ],
        100
      );

      // Análisis de consultas
      const categories = {};
      const risks = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
      let totalConfidence = 0;

      for (const query of queries.documents) {
        categories[query.category] = (categories[query.category] || 0) + 1;
        if (query.risk_level && risks[query.risk_level] !== undefined) {
          risks[query.risk_level] = (risks[query.risk_level] || 0) + 1;
        }
        totalConfidence += query.confidence || 0;
      }

      const totalQueries = queries.documents.length;
      const avgConfidence = totalQueries > 0 ? totalConfidence / totalQueries : 0;

      return {
        cooperative: {
          id: cooperative.$id,
          name: cooperative.name,
          country: cooperative.country
        },
        metrics: {
          total_users: users.total,
          total_queries: totalQueries,
          avg_confidence: avgConfidence,
          categories: categories,
          risks: risks,
          risk_score: this.calculateRiskScore(risks)
        },
        insights: this.generateInsights({
          totalQueries,
          avgConfidence,
          categories,
          risks
        })
      };

    } catch (error) {
      console.error('Error en getCooperativeMetrics:', error);
      throw error;
    }
  }

  calculateRiskScore(risks) {
    const weights = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 5 };
    let total = 0;
    let count = 0;

    for (const [level, value] of Object.entries(risks)) {
      total += (weights[level] || 0) * value;
      count += value;
    }

    return count > 0 ? Math.min(10, total / count) : 0;
  }

  generateInsights(data) {
    const insights = [];

    if (data.totalQueries === 0) {
      insights.push('No hay consultas registradas');
      return insights;
    }

    if (data.avgConfidence < 0.6) {
      insights.push('⚠️ La precisión de las respuestas es baja. Revisar la base de conocimiento.');
    }

    if (data.risks.HIGH > 0 || data.risks.CRITICAL > 0) {
      insights.push(`⚠️ Se detectaron ${data.risks.HIGH + data.risks.CRITICAL} consultas de alto riesgo. Requieren revisión.`);
    }

    const topCategory = Object.entries(data.categories)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory) {
      insights.push(`📊 La categoría más consultada es "${topCategory[0]}" (${topCategory[1]} consultas)`);
    }

    return insights;
  }

  async getComparativeMetrics() {
    try {
      const cooperatives = await this.databases.listDocuments(
        this.databaseId,
        'cooperatives'
      );

      const results = [];
      for (const coop of cooperatives.documents) {
        const metrics = await this.getCooperativeMetrics(coop.$id);
        results.push(metrics);
      }

      return {
        cooperatives: results,
        total: cooperatives.total
      };

    } catch (error) {
      console.error('Error en getComparativeMetrics:', error);
      throw error;
    }
  }
}

module.exports = { CooperativeMetrics };