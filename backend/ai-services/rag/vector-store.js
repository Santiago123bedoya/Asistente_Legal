// backend/ai-services/rag/vector-store.js
// 🗄️ Conexión con Vector DB

// TODO: Implementar conexión con Pinecone, Weaviate o Qdrant
// Esta es una implementación mock para desarrollo

class VectorStore {
  constructor() {
    this.vectors = {};
    this.metadata = {};
  }

  async addVector(id, vector, metadata = {}) {
    this.vectors[id] = vector;
    this.metadata[id] = metadata;
    return id;
  }

  async addVectors(vectors) {
    const ids = [];
    for (const v of vectors) {
      const id = v.id || `vec_${Date.now()}_${Math.random()}`;
      await this.addVector(id, v.vector, v.metadata);
      ids.push(id);
    }
    return ids;
  }

  async search(queryVector, topK = 10) {
    // Buscar por similitud de coseno
    const results = [];
    for (const [id, vector] of Object.entries(this.vectors)) {
      const similarity = this.cosineSimilarity(queryVector, vector);
      results.push({
        id,
        similarity,
        metadata: this.metadata[id] || {}
      });
    }

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  async deleteVector(id) {
    delete this.vectors[id];
    delete this.metadata[id];
  }

  async clear() {
    this.vectors = {};
    this.metadata = {};
  }

  async getStats() {
    return {
      total_vectors: Object.keys(this.vectors).length,
      total_metadata: Object.keys(this.metadata).length
    };
  }
}

module.exports = { VectorStore };