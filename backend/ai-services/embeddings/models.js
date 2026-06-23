// backend/ai-services/embeddings/models.js
// 📊 Configuración de modelos de embeddings

const embeddingModels = {
  // DeepSeek/OpenAI compatible
  'deepseek-embed': {
    provider: 'deepseek',
    model: 'text-embedding-3-small',
    dimensions: 1536,
    max_input_tokens: 8192
  },
  
  // Para uso local (open-source)
  'sentence-bert': {
    provider: 'sentence-transformers',
    model: 'all-MiniLM-L6-v2',
    dimensions: 384,
    max_input_tokens: 512
  },
  
  'bge-large': {
    provider: 'bge',
    model: 'BAAI/bge-large-en-v1.5',
    dimensions: 1024,
    max_input_tokens: 512
  }
};

const getEmbeddingModel = (name = 'deepseek-embed') => {
  return embeddingModels[name] || embeddingModels['deepseek-embed'];
};

module.exports = { embeddingModels, getEmbeddingModel };