// backend/appwrite/functions/notification/index.js
// 🔔 Sistema de notificaciones

const { Client, Databases } = require('node-appwrite');

module.exports = async function(req, res) {
  console.log('🔔 Iniciando Notification Service...');

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { action, data } = req.body;
  const userId = req.headers['x-user-id'];

  const databaseId = process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db';

  try {
    switch(action) {
      // 📋 LISTAR NOTIFICACIONES
      case 'list': {
        console.log(`📋 Listando notificaciones para ${userId}`);
        
        const notifications = await databases.listDocuments(
          databaseId,
          'alerts',
          [`userId == "${userId}"`],
          data.limit || 50,
          0,
          'timestamp',
          'desc'
        );

        return res.json({
          success: true,
          notifications: notifications.documents,
          total: notifications.total
        });
      }

      // 👁️ MARCAR COMO LEÍDA
      case 'read': {
        console.log(`👁️ Marcando notificación ${data.notificationId} como leída`);
        
        if (!data.notificationId) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere notificationId'
          });
        }

        await databases.updateDocument(
          databaseId,
          'alerts',
          data.notificationId,
          { read: true }
        );

        return res.json({
          success: true,
          message: 'Notificación marcada como leída'
        });
      }

      // 📨 CREAR NOTIFICACIÓN
      case 'create': {
        console.log(`📨 Creando notificación para ${data.userId}`);
        
        if (!data.userId || !data.title || !data.message) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere userId, title y message'
          });
        }

        const notification = await databases.createDocument(
          databaseId,
          'alerts',
          'unique()',
          {
            userId: data.userId,
            type: data.type || 'info',
            title: data.title,
            message: data.message,
            details: data.details || '',
            read: false,
            timestamp: new Date().toISOString()
          }
        );

        return res.json({
          success: true,
          notification
        });
      }

      default:
        return res.status(400).json({
          success: false,
          error: `Acción no válida: ${action}`
        });
    }

  } catch (error) {
    console.error('❌ Error en notification:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
};