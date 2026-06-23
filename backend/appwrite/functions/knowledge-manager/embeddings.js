// backend/appwrite/functions/knowledge-manager/embeddings.js
// 🔢 Generación de embeddings

const OpenAI = require('openai');

class EmbeddingService {
  constructor() {
    this.client = new OpenAI({
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY
    });
  }

  async generateEmbedding(text) {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.substring(0, 8000) // Limitar tamaño
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generando embedding:', error);
      throw error;
    }
  }

  async generateBatchEmbeddings(texts) {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts.map(t => t.substring(0, 8000))
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('Error generando embeddings batch:', error);
      throw error;
    }
  }
}

module.exports = { EmbeddingService };