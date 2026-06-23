// backend/ai-services/rag/retriever.js
// 🔍 Búsqueda semántica

const { Client, Databases } = require('node-appwrite');

class Retriever {
  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    this.databases = new Databases(this.client);
    this.databaseId = process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db';
  }

  async retrieve(question, filters = {}) {
    try {
      let queries = [`status == "active"`];

      if (filters.country) {
        queries.push(`country == "${filters.country}"`);
      }

      if (filters.category) {
        queries.push(`category == "${filters.category}"`);
      }

      if (filters.document_type) {
        queries.push(`document_type == "${filters.document_type}"`);
      }

      // Búsqueda por similitud semántica
      if (filters.semantic) {
        // Aquí se implementaría búsqueda vectorial con Pinecone/Weaviate
        // Por ahora usamos búsqueda de texto
        queries.push(`search(content, "${question}")`);
      }

      const results = await this.databases.listDocuments(
        this.databaseId,
        'knowledge_base',
        queries,
        filters.limit || 20,
        filters.offset || 0,
        'relevance_score',
        'desc'
      );

      return results.documents;

    } catch (error) {
      console.error('Error en retrieve:', error);
      return [];
    }
  }

  async semanticSearch(question, topK = 10) {
    // Implementación para búsqueda vectorial
    // Requiere Vector DB como Pinecone o Weaviate
    try {
      // TODO: Integrar con Vector DB
      console.log('🔍 Búsqueda semántica no implementada, usando fallback');
      return this.retrieve(question, { limit: topK });
    } catch (error) {
      console.error('Error en semanticSearch:', error);
      return [];
    }
  }
}

module.exports = { Retriever };