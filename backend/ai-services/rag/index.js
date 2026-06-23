// backend/ai-services/rag/index.js
// 📚 Sistema RAG completo

const { Client, Databases } = require('node-appwrite');
const { LLMService } = require('../llm');

class RAGPipeline {
  constructor() {
    this.llmService = new LLMService();
    
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    this.databases = new Databases(this.client);
    this.databaseId = process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db';
    this.maxDocuments = 10;
  }

  async process({ question, context = {} }) {
    console.log('📚 Iniciando pipeline RAG...');
    const startTime = Date.now();

    try {
      let documents = await this.searchRelevantDocuments(question, context);
      console.log(`📄 Encontrados ${documents.length} documentos`);

      if (documents.length > 2) {
        documents = await this.llmService.rerankDocuments(question, documents);
      }

      const contextText = this.extractContext(documents);
      const coverage = await this.checkCoverage(question, contextText);

      let finalDocuments = documents;
      let finalContext = contextText;

      if (coverage < 0.5) {
        console.log('🔄 Expandiendo búsqueda...');
        const expandedDocs = await this.expandSearch(question, context);
        const allDocs = [...documents, ...expandedDocs];
        finalDocuments = await this.llmService.rerankDocuments(question, allDocs);
        finalContext = this.extractContext(finalDocuments);
      }

      const sources = finalDocuments.slice(0, 5).map(doc => ({
        id: doc.$id,
        title: doc.title || 'Documento',
        category: doc.category || 'General',
        snippet: this.getSnippet(doc.content || '', 300),
        relevance: doc.relevance || 0.5,
        source: `${doc.document_type || 'Documento'} - ${doc.country || 'N/A'}`
      }));

      return {
        context: finalContext,
        sources,
        document_count: finalDocuments.length,
        processing_time: Date.now() - startTime,
        coverage,
        metadata: {
          primary_category: this.getPrimaryCategory(finalDocuments),
          has_sufficient_context: finalContext.length > 200
        }
      };

    } catch (error) {
      console.error('❌ Error en RAG:', error);
      return {
        context: '',
        sources: [],
        document_count: 0,
        processing_time: Date.now() - startTime,
        coverage: 0,
        error: error.message
      };
    }
  }

  async searchRelevantDocuments(question, context) {
    try {
      const country = context.country || 'Latinoamérica';
      const categories = await this.extractCategories(question);

      let queries = [`status == "active"`, `country == "${country}"`];
      
      if (categories.length > 0) {
        const categoryQuery = categories.map(c => `category == "${c}"`).join(' || ');
        queries.push(`(${categoryQuery})`);
      }

      const results = await this.databases.listDocuments(
        this.databaseId,
        'knowledge_base',
        queries,
        20,
        0,
        'relevance_score',
        'desc'
      );

      if (results.documents.length === 0) {
        const expanded = await this.databases.listDocuments(
          this.databaseId,
          'knowledge_base',
          [`status == "active"`],
          20,
          0,
          'relevance_score',
          'desc'
        );
        return expanded.documents;
      }

      return results.documents;

    } catch (error) {
      console.error('Error en búsqueda:', error);
      return [];
    }
  }

  async expandSearch(question, context) {
    try {
      const keywords = await this.extractKeywords(question);
      if (keywords.length === 0) return [];

      const keywordQuery = keywords.map(k => `search(content, "${k}")`).join(' || ');
      
      const results = await this.databases.listDocuments(
        this.databaseId,
        'knowledge_base',
        [`status == "active"`, `(${keywordQuery})`],
        10
      );

      return results.documents.map(doc => ({
        ...doc,
        relevance: 0.4
      }));

    } catch (error) {
      console.error('Error en expandSearch:', error);
      return [];
    }
  }

  async extractCategories(question) {
    try {
      const result = await this.llmService.categorizeQuestion(question);
      return [result.primary];
    } catch {
      return ['GENERAL'];
    }
  }

  async extractKeywords(question) {
    try {
      const response = await this.llmService.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Extrae las palabras clave de esta consulta legal. Responde SOLO con las palabras clave separadas por comas.'
          },
          { role: 'user', content: question }
        ],
        temperature: 0.1,
        max_tokens: 100,
      });

      const text = response.choices[0].message.content;
      return text.split(',').map(k => k.trim()).filter(k => k.length > 3);

    } catch (error) {
      console.error('Error extrayendo keywords:', error);
      return question.split(' ').filter(w => w.length > 4).slice(0, 5);
    }
  }

  extractContext(documents) {
    if (!documents || documents.length === 0) return '';
    
    const topDocs = documents.slice(0, 5);
    let context = '';

    topDocs.forEach((doc, index) => {
      const content = doc.content || doc.text || '';
      const title = doc.title || `Fuente ${index + 1}`;
      
      context += `\n[📄 FUENTE ${index + 1}: ${title}]\n`;
      context += `Categoría: ${doc.category || 'General'}\n`;
      context += content.substring(0, 1500);
      context += content.length > 1500 ? '...' : '';
      context += '\n';
    });

    return context;
  }

  async checkCoverage(question, context) {
    if (!context || context.length < 50) return 0;

    try {
      const response = await this.llmService.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Evalúa si el contexto es suficiente para responder la consulta. Responde SOLO con un número entre 0 y 1.'
          },
          {
            role: 'user',
            content: `Consulta: ${question}\n\nContexto: ${context.substring(0, 1000)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 20,
      });

      const score = parseFloat(response.choices[0].message.content);
      return Math.max(0, Math.min(1, score || 0));

    } catch (error) {
      console.error('Error verificando cobertura:', error);
      return Math.min(1, context.length / 1000);
    }
  }

  getSnippet(text, maxLength = 300) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getPrimaryCategory(documents) {
    if (!documents || documents.length === 0) return 'GENERAL';
    
    const categories = {};
    documents.forEach(doc => {
      const cat = doc.category || 'GENERAL';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const primary = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])[0];
    
    return primary ? primary[0] : 'GENERAL';
  }
}

module.exports = { RAGPipeline };