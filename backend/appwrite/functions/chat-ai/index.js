// backend/appwrite/functions/chat-ai/index.js
// Función principal de chat para Appwrite Cloud Functions

const { Client, Databases } = require('node-appwrite');
const { LLMService } = require('../../../ai-services/llm-service');
const { RAGPipeline } = require('../../../ai-services/rag');

// Configuración
const APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db';

module.exports = async function(req, res) {
  console.log('🚀 Iniciando Legal-iCoop Chat...');

  // Inicializar Appwrite
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  // Inicializar servicios
  const llmService = new LLMService();
  const ragPipeline = new RAGPipeline();

  // Obtener datos de la solicitud
  const { question, userId, useRAG = true } = req.body;
  const userRole = req.headers['x-user-role'] || 'user';

  // 🔐 Validación de autenticación
  if (!userId || !['admin', 'user'].includes(userRole)) {
    return res.status(401).json({
      success: false,
      error: 'Usuario no autenticado o no autorizado'
    });
  }

  const startTime = Date.now();

  try {
    console.log(`👤 Usuario: ${userId} - Rol: ${userRole}`);
    console.log(`❓ Pregunta: ${question.substring(0, 100)}...`);

    // 📚 Obtener información del usuario
    let userDoc = null;
    let cooperative = null;

    try {
      userDoc = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        'users',
        userId
      );

      if (userDoc.cooperative) {
        cooperative = await databases.getDocument(
          APPWRITE_DATABASE_ID,
          'cooperatives',
          userDoc.cooperative
        );
      }
    } catch (error) {
      console.warn('⚠️ No se pudo obtener información del usuario:', error.message);
    }

    // 📊 Construir contexto
    const context = {
      country: cooperative?.country || 'Latinoamérica',
      cooperative_type: cooperative?.type || 'general',
      user_role: userDoc?.role || userRole,
      cooperative_name: cooperative?.name,
      regulatory_base: cooperative?.regulatory_base,
    };

    console.log('📊 Contexto:', JSON.stringify(context, null, 2));

    // 🤖 PROCESAR CON RAG
    let ragResult = null;
    let responseText = '';
    let sources = [];

    if (useRAG) {
      ragResult = await ragPipeline.process({
        question,
        context
      });
      
      if (ragResult && ragResult.context) {
        console.log(`📚 Contexto RAG: ${ragResult.context.length} caracteres`);
        console.log(`📄 Fuentes: ${ragResult.sources?.length || 0} documentos`);
      }
    }

    // 🧠 GENERAR RESPUESTA CON DEEPSEEK
    const llmResponse = await llmService.generateResponse({
      question,
      context: ragResult?.context || '',
      sources: ragResult?.sources || [],
      userContext: context,
      useRAG: useRAG && ragResult?.context?.length > 100
    });

    responseText = llmResponse.text;
    sources = ragResult?.sources || [];

    console.log(`✅ Respuesta generada (${llmResponse.processing_time}ms)`);

    // ⚠️ DETECTAR RIESGOS
    let riskAnalysis = null;
    try {
      riskAnalysis = await llmService.detectRisks({
        question,
        response: responseText,
        context: ragResult?.context || ''
      });
      console.log(`⚠️ Riesgos detectados: ${riskAnalysis?.level || 'NONE'}`);
    } catch (error) {
      console.warn('⚠️ Error en detección de riesgos:', error.message);
    }

    // 🏷️ CATEGORIZAR
    let category = { primary: 'GENERAL', secondary: 'General' };
    try {
      category = await llmService.categorizeQuestion(question);
      console.log(`🏷️ Categoría: ${category.primary} > ${category.secondary}`);
    } catch (error) {
      console.warn('⚠️ Error en categorización:', error.message);
    }

    // 💾 GUARDAR EN HISTORIAL
    let chatId = null;
    try {
      const chatEntry = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        'chat_history',
        'unique()',
        {
          userId,
          question: question,
          response: responseText,
          category: category.primary,
          subcategory: category.secondary,
          sources: JSON.stringify(sources),
          confidence: llmResponse.confidence || 0.7,
          timestamp: new Date().toISOString(),
          processing_time: Date.now() - startTime,
          risk_detected: riskAnalysis?.has_risk || false,
          risk_level: riskAnalysis?.level || 'NONE',
          resolution_status: 'pending',
        }
      );
      chatId = chatEntry.$id;
      console.log(`💾 Historial guardado: ${chatId}`);
    } catch (error) {
      console.error('❌ Error guardando historial:', error.message);
    }

    // 📊 ACTUALIZAR MÉTRICAS
    try {
      await updateMetrics(databases, {
        question_count: 1,
        category: category.primary,
        response_time: Date.now() - startTime,
        confidence: llmResponse.confidence || 0.7,
        risk_detected: riskAnalysis?.has_risk || false,
        risk_level: riskAnalysis?.level || 'NONE'
      });
    } catch (error) {
      console.warn('⚠️ Error actualizando métricas:', error.message);
    }

    // 📝 CONSTRUIR RESPUESTA
    const response = {
      success: true,
      response: {
        text: responseText,
        sources: sources,
        category: category.primary,
        subcategory: category.secondary,
        confidence: llmResponse.confidence || 0.7,
        processing_time: Date.now() - startTime,
        chatId: chatId,
        timestamp: new Date().toISOString(),
        risk: {
          detected: riskAnalysis?.has_risk || false,
          level: riskAnalysis?.level || 'NONE',
          description: riskAnalysis?.description || '',
          recommendations: riskAnalysis?.recommendations || ''
        },
        needs_human: (riskAnalysis?.level === 'CRITICAL' || riskAnalysis?.level === 'HIGH') || 
                     (llmResponse.confidence || 1) < 0.5,
        legal_validation: {
          status: llmResponse.confidence > 0.7 ? 'validated' : 'needs_review',
          warnings: llmResponse.confidence < 0.7 ? ['Revisar con asesor humano'] : []
        }
      }
    };

    // ⚠️ ESCALAR A HUMANO SI ES CRÍTICO
    if (riskAnalysis?.level === 'CRITICAL' || riskAnalysis?.level === 'HIGH') {
      try {
        await createAlert(databases, {
          userId,
          question,
          riskLevel: riskAnalysis.level,
          riskDescription: riskAnalysis.description,
          chatId: chatId
        });
        console.log('🔔 Alerta creada para admins');
        
        response.response.escalated = true;
        response.response.escalation_reason = `Riesgo ${riskAnalysis.level} detectado: ${riskAnalysis.description}`;
      } catch (error) {
        console.warn('⚠️ Error creando alerta:', error.message);
      }
    }

    console.log(`✅ Chat completado en ${Date.now() - startTime}ms`);
    res.json(response);

  } catch (error) {
    console.error('❌ Error fatal en chat:', error);
    
    // Registrar error
    try {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        'metrics',
        'unique()',
        {
          date: new Date().toISOString(),
          metric_type: 'error_logs',
          value: 1,
          dimensions: JSON.stringify({
            userId,
            error: error.message,
            question: question?.substring(0, 100)
          })
        }
      );
    } catch (e) {
      console.error('Error registrando error:', e);
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la consulta',
      message: 'Por favor, intenta de nuevo más tarde o contacta a tu asesor legal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 📊 Función para actualizar métricas
async function updateMetrics(databases, data) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const metrics = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      'metrics',
      [
        `date >= "${today}T00:00:00.000Z"`,
        `date <= "${today}T23:59:59.999Z"`,
        `metric_type == "daily_metrics"`
      ]
    );

    if (metrics.documents.length > 0) {
      const existing = metrics.documents[0];
      const dims = JSON.parse(existing.dimensions || '{}');
      
      dims.total_questions = (dims.total_questions || 0) + 1;
      dims.total_response_time = (dims.total_response_time || 0) + data.response_time;
      dims.avg_confidence = ((dims.avg_confidence || 0) * (dims.total_questions - 1) + data.confidence) / dims.total_questions;
      dims.risks_detected = (dims.risks_detected || 0) + (data.risk_detected ? 1 : 0);
      
      dims.risk_levels = dims.risk_levels || {};
      if (data.risk_level && data.risk_level !== 'NONE') {
        dims.risk_levels[data.risk_level] = (dims.risk_levels[data.risk_level] || 0) + 1;
      }
      
      if (data.category) {
        dims.categories = dims.categories || {};
        dims.categories[data.category] = (dims.categories[data.category] || 0) + 1;
      }
      
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        'metrics',
        existing.$id,
        {
          dimensions: JSON.stringify(dims),
          value: dims.total_questions
        }
      );
    } else {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        'metrics',
        'unique()',
        {
          date: new Date().toISOString(),
          metric_type: 'daily_metrics',
          value: 1,
          dimensions: JSON.stringify({
            total_questions: 1,
            total_response_time: data.response_time,
            avg_confidence: data.confidence,
            risks_detected: data.risk_detected ? 1 : 0,
            risk_levels: data.risk_level && data.risk_level !== 'NONE' ? { [data.risk_level]: 1 } : {},
            categories: { [data.category]: 1 }
          })
        }
      );
    }
  } catch (error) {
    console.error('Error en updateMetrics:', error);
  }
}

// 🔔 Función para crear alerta
async function createAlert(databases, data) {
  try {
    // Buscar admins
    const admins = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      'users',
      [`role == "admin"`]
    );

    for (const admin of admins.documents) {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        'alerts',
        'unique()',
        {
          userId: admin.$id,
          type: 'critical_legal_risk',
          title: `⚠️ Alerta de Riesgo ${data.riskLevel}`,
          message: `Se ha detectado un riesgo ${data.riskLevel} en una consulta legal`,
          details: JSON.stringify({
            userId: data.userId,
            question: data.question.substring(0, 200),
            riskLevel: data.riskLevel,
            riskDescription: data.riskDescription,
            chatId: data.chatId
          }),
          read: false,
          timestamp: new Date().toISOString()
        }
      );
    }
  } catch (error) {
    console.error('Error en createAlert:', error);
  }
}