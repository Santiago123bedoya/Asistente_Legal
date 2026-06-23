// backend/ai-services/llm/index.js
// 🧠 Servicio LLM con DeepSeek

const OpenAI = require('openai');

class LLMService {
  constructor() {
    // Configuración para DeepSeek (API compatible con OpenAI)
    this.client = new OpenAI({
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
      timeout: 60000,
      maxRetries: 3,
    });

    this.models = {
      REASONING: 'deepseek-reasoner',
      CHAT: 'deepseek-chat',
      FLASH: 'deepseek-v4-flash',
    };

    this.config = {
      legal_advice: { temperature: 0.1, max_tokens: 2000 },
      categorizacion: { temperature: 0.1, max_tokens: 200 },
      risk_detection: { temperature: 0.1, max_tokens: 500 },
      reranking: { temperature: 0.1, max_tokens: 300 },
      general: { temperature: 0.3, max_tokens: 1500 },
    };

    this.systemPrompt = `Eres LEGAL-iCoop, un Asesor Legal Inteligente especializado en Derecho Cooperativo Latinoamericano.

    TU ROL:
    - Eres un asesor legal experto en legislación cooperativa
    - Proporcionas respuestas precisas basadas en la legislación vigente
    - Ayudas a cooperativas a mantener su autonomía y cumplir con la normativa
    - Identificas riesgos legales y proporcionas alertas tempranas

    PRINCIPIOS:
    1. Precisión legal sobre todo
    2. Claridad y lenguaje accesible para consejos directivos
    3. Contexto cooperativo siempre presente
    4. Identificación clara de límites de tu conocimiento
    5. Recomendación de consulta con abogado humano para casos complejos

    TEMAS QUE CUBRES:
    - Control democrático y gobierno cooperativo
    - Derechos y obligaciones de asociados
    - Externalización de funciones y límites
    - Protección de datos de asociados
    - Procedimientos de fusión y reestructuración
    - Normativa laboral en cooperativas
    - Aspectos financieros y contables
    - Estatutos y reglamentos internos

    SI NO SABES ALGO:
    - Indica claramente que no tienes información suficiente
    - No inventes información legal
    - Sugiere consultar con un abogado especializado
    - Proporciona referencias a fuentes cuando sea posible

    Responde en español de forma clara, estructurada y práctica.`;

    this.ragSystemPrompt = `Eres LEGAL-iCoop, un Asesor Legal Inteligente especializado en Derecho Cooperativo.

    Has recibido información específica de la base de conocimiento legal que DEBES utilizar para responder.

    INSTRUCCIONES:
    1. Basa tu respuesta ÚNICAMENTE en el contexto legal proporcionado
    2. Si el contexto no contiene información suficiente, indícalo claramente
    3. Cita las fuentes específicas que respaldan tu respuesta
    4. Identifica cualquier riesgo legal potencial
    5. Si es necesario, recomienda consultar con un abogado especializado

    CONTEXTO LEGAL A UTILIZAR:
    {{context}}

    Responde de forma clara, estructurada y con referencias a las fuentes.`;
  }

  async generateResponse({ question, context = '', sources = [], userContext = {}, useRAG = true, model = 'chat' }) {
    try {
      console.log('🧠 Generando respuesta con DeepSeek...');
      const startTime = Date.now();

      const modelName = model === 'reasoning' ? this.models.REASONING : this.models.CHAT;
      const config = this.config.legal_advice;

      const messages = [];

      if (useRAG && context) {
        messages.push({
          role: 'system',
          content: this.ragSystemPrompt.replace('{{context}}', context)
        });
      } else {
        messages.push({
          role: 'system',
          content: this.systemPrompt
        });
      }

      const userInfo = this.buildUserInfo(userContext);
      messages.push({
        role: 'user',
        content: `[Contexto del usuario: ${userInfo}]\n\nConsultaLegal: ${question}`
      });

      const completion = await this.client.chat.completions.create({
        model: modelName,
        messages,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      });

      const responseText = completion.choices[0].message.content;
      const processingTime = Date.now() - startTime;

      const confidence = this.calculateConfidence(responseText, context, sources);

      return {
        text: responseText,
        confidence,
        tokens_used: completion.usage.total_tokens,
        processing_time: processingTime,
        model_used: modelName,
      };

    } catch (error) {
      console.error('❌ Error en LLM Service:', error);
      throw new Error(`Error al generar respuesta: ${error.message}`);
    }
  }

  async categorizeQuestion(question) {
    try {
      const config = this.config.categorizacion;
      
      const completion = await this.client.chat.completions.create({
        model: this.models.CHAT,
        messages: [
          {
            role: 'system',
            content: `Eres un clasificador experto en derecho cooperativo. Clasifica la consulta en una categoría y subcategoría.
            
            Categorías posibles:
            - GOBIERNO_COOPERATIVO: Control democrático, consejos, asambleas
            - DERECHOS_ASOCIADOS: Derechos, obligaciones, participación
            - FINANZAS: Contabilidad, auditoría, fondos
            - FUSION: Fusiones, incorporaciones, reestructuración
            - DATOS: Protección de datos, privacidad
            - LABORAL: Contratación, derechos laborales
            - ESTATUTOS: Estatutos, reglamentos, reformas
            - RESPONSABILIDAD: Responsabilidad legal, riesgos
            - EXTERNALIZACION: Externalización de funciones
            - GENERAL: Otros temas

            Responde ÚNICAMENTE con el formato: CATEGORIA|SUBCATEGORIA
            Ejemplo: GOBIERNO_COOPERATIVO|Control_Democratico`
          },
          { role: 'user', content: `Clasifica: "${question}"` }
        ],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      });

      const result = completion.choices[0].message.content.trim();
      const parts = result.split('|');
      
      return {
        primary: parts[0] || 'GENERAL',
        secondary: parts[1] || 'General'
      };

    } catch (error) {
      console.error('Error en categorización:', error);
      return { primary: 'GENERAL', secondary: 'General' };
    }
  }

  async detectRisks({ question, response, context }) {
    try {
      const config = this.config.risk_detection;

      const completion = await this.client.chat.completions.create({
        model: this.models.REASONING,
        messages: [
          {
            role: 'system',
            content: `Eres un experto en detección de riesgos legales para cooperativas.
            
            Analiza la consulta y la respuesta generada para identificar potenciales riesgos legales.

            Niveles de riesgo:
            - CRITICAL: Riesgo inminente, requiere acción inmediata
            - HIGH: Riesgo significativo, requiere atención prioritaria
            - MEDIUM: Riesgo moderado, requiere monitoreo
            - LOW: Riesgo bajo, mantener vigilancia
            - NONE: Sin riesgo detectado

            Responde en formato JSON:
            {
              "has_risk": true/false,
              "level": "CRITICAL|HIGH|MEDIUM|LOW|NONE",
              "description": "Descripción del riesgo detectado",
              "recommendations": "Recomendación de acción"
            }`
          },
          {
            role: 'user',
            content: `Consulta: ${question}\n\nRespuesta generada: ${response}\n\nContexto: ${context || 'No disponible'}`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('Error en detección de riesgos:', error);
      return {
        has_risk: false,
        level: 'NONE',
        description: 'No se pudo determinar',
        recommendations: 'Revisar manualmente'
      };
    }
  }

  async rerankDocuments(question, documents) {
    if (!documents || documents.length === 0) return [];

    try {
      const config = this.config.reranking;
      
      const docInfo = documents.slice(0, 10).map((doc, i) => 
        `${i + 1}. Título: ${doc.title}\n   Categoría: ${doc.category}\n   Resumen: ${doc.summary || doc.content?.substring(0, 300)}`
      ).join('\n\n');

      const completion = await this.client.chat.completions.create({
        model: this.models.CHAT,
        messages: [
          {
            role: 'system',
            content: `Eres un experto en relevancia legal. Re-ranking de documentos para una consulta legal.

            Responde con un ranking de los documentos más relevantes para la consulta.
            
            FORMATO DE RESPUESTA: Números de los documentos ordenados por relevancia (1 = más relevante).
            Ejemplo: [2, 1, 4, 3, 5]`
          },
          {
            role: 'user',
            content: `Consulta: ${question}\n\nDocumentos:\n${docInfo}\n\nOrdena del más relevante al menos relevante.`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      });

      const rankingText = completion.choices[0].message.content;
      const ranking = this.parseRanking(rankingText, documents.length);

      const reranked = [];
      for (const idx of ranking) {
        if (idx < documents.length) {
          reranked.push({
            ...documents[idx],
            relevance: 1 - (ranking.indexOf(idx) / documents.length)
          });
        }
      }

      return reranked;

    } catch (error) {
      console.error('Error en reranking:', error);
      return documents.map((doc, i) => ({
        ...doc,
        relevance: 1 - (i / documents.length)
      }));
    }
  }

  buildUserInfo(userContext) {
    const info = [];
    if (userContext.country) info.push(`País: ${userContext.country}`);
    if (userContext.cooperative_type) info.push(`Tipo: ${userContext.cooperative_type}`);
    if (userContext.user_role) info.push(`Rol: ${userContext.user_role}`);
    return info.join(' | ') || 'Usuario cooperativo';
  }

  calculateConfidence(response, context, sources) {
    let score = 0.7;
    if (context && context.length > 100) score += 0.15;
    if (sources && sources.length > 0) score += 0.1;
    if (response.length < 100) score -= 0.1;
    return Math.max(0.1, Math.min(0.95, score));
  }

  parseRanking(rankingText, maxDocs) {
    try {
      const numbers = JSON.parse(rankingText);
      return numbers.filter(n => n > 0 && n <= maxDocs).map(n => n - 1);
    } catch {
      const matches = rankingText.match(/\d+/g);
      if (matches) {
        return matches.map(n => parseInt(n) - 1).filter(n => n >= 0 && n < maxDocs);
      }
    }
    return Array.from({ length: Math.min(maxDocs, 10) }, (_, i) => i);
  }
}

module.exports = { LLMService };