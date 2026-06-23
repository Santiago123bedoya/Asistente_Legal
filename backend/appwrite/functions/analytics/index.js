// backend/appwrite/functions/analytics/index.js
// 📊 Métricas y análisis

const { Client, Databases } = require('node-appwrite');

module.exports = async function(req, res) {
  console.log('📊 Iniciando Analytics...');

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const userRole = req.headers['x-user-role'] || 'user';

  // 🔐 Solo admin puede ver analytics
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Solo administradores pueden acceder a analytics.'
    });
  }

  const { action, data } = req.body;
  const databaseId = process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db';

  try {
    switch(action) {
      // 📊 MÉTRICAS DIARIAS
      case 'daily': {
        console.log('📊 Obteniendo métricas diarias...');
        
        const date = data.date || new Date().toISOString().split('T')[0];
        const startDate = `${date}T00:00:00.000Z`;
        const endDate = `${date}T23:59:59.999Z`;

        const metrics = await databases.listDocuments(
          databaseId,
          'metrics',
          [
            `date >= "${startDate}"`,
            `date <= "${endDate}"`,
            `metric_type == "daily_metrics"`
          ],
          1
        );

        if (metrics.documents.length === 0) {
          return res.json({
            success: true,
            date,
            metrics: {
              total_questions: 0,
              avg_confidence: 0,
              risks_detected: 0,
              categories: {}
            }
          });
        }

        const dims = JSON.parse(metrics.documents[0].dimensions || '{}');
        
        return res.json({
          success: true,
          date,
          metrics: {
            total_questions: dims.total_questions || 0,
            avg_response_time: dims.total_questions > 0 ? Math.round(dims.total_response_time / dims.total_questions) : 0,
            avg_confidence: dims.avg_confidence || 0,
            risks_detected: dims.risks_detected || 0,
            risk_levels: dims.risk_levels || {},
            categories: dims.categories || {}
          }
        });
      }

      // 📊 MÉTRICAS DE RANGO
      case 'range': {
        console.log('📊 Obteniendo métricas de rango...');
        
        const startDate = data.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = data.endDate || new Date().toISOString();

        const metrics = await databases.listDocuments(
          databaseId,
          'metrics',
          [
            `date >= "${startDate}"`,
            `date <= "${endDate}"`,
            `metric_type == "daily_metrics"`
          ],
          100
        );

        // Agregar métricas
        const aggregated = {
          total_questions: 0,
          total_response_time: 0,
          total_risks: 0,
          avg_confidence: 0,
          daily: []
        };

        for (const doc of metrics.documents) {
          const dims = JSON.parse(doc.dimensions || '{}');
          const totalQ = dims.total_questions || 0;
          
          aggregated.total_questions += totalQ;
          aggregated.total_response_time += dims.total_response_time || 0;
          aggregated.total_risks += dims.risks_detected || 0;
          
          aggregated.daily.push({
            date: doc.date.split('T')[0],
            questions: totalQ,
            confidence: dims.avg_confidence || 0,
            risks: dims.risks_detected || 0
          });
        }

        aggregated.avg_confidence = aggregated.total_questions > 0 ? 
          (aggregated.total_response_time / aggregated.total_questions) : 0;

        return res.json({
          success: true,
          startDate,
          endDate,
          metrics: aggregated
        });
      }

      // 📊 MÉTRICAS DE USUARIOS
      case 'users': {
        console.log('📊 Obteniendo métricas de usuarios...');
        
        const users = await databases.listDocuments(
          databaseId,
          'users'
        );

        const admins = users.documents.filter(u => u.role === 'admin');
        const verified = users.documents.filter(u => u.verified);

        return res.json({
          success: true,
          users: {
            total: users.total,
            admins: admins.length,
            verified: verified.length,
            pending: users.total - verified.length
          }
        });
      }

      // 📊 MÉTRICAS DE CONOCIMIENTO
      case 'knowledge': {
        console.log('📊 Obteniendo métricas de conocimiento...');
        
        const knowledge = await databases.listDocuments(
          databaseId,
          'knowledge_base',
          [`status == "active"`],
          100
        );

        const categories = {};
        const countries = {};
        const types = {};

        for (const doc of knowledge.documents) {
          categories[doc.category] = (categories[doc.category] || 0) + 1;
          countries[doc.country] = (countries[doc.country] || 0) + 1;
          types[doc.document_type] = (types[doc.document_type] || 0) + 1;
        }

        return res.json({
          success: true,
          knowledge: {
            total: knowledge.total,
            by_category: categories,
            by_country: countries,
            by_type: types
          }
        });
      }

      default:
        return res.status(400).json({
          success: false,
          error: `Acción no válida: ${action}`
        });
    }

  } catch (error) {
    console.error('❌ Error en analytics:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};