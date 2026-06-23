// backend/appwrite/functions/knowledge-manager/index.js
// 📚 Gestión de Base de Conocimiento

const { Client, Databases } = require('node-appwrite');
const { EmbeddingService } = require('../../../ai-services/embeddings');

module.exports = async function(req, res) {
  console.log('📚 Iniciando Knowledge Manager...');

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const embeddingService = new EmbeddingService();

  const { action, data } = req.body;
  const userRole = req.headers['x-user-role'] || 'user';

  // 🔐 Solo admin puede modificar conocimiento
  const writeActions = ['create', 'update', 'delete', 'batch-import'];
  if (writeActions.includes(action) && userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Solo administradores pueden modificar la base de conocimiento.'
    });
  }

  const databaseId = process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db';
  const collectionId = 'knowledge_base';

  try {
    switch(action) {
      // 📝 CREAR DOCUMENTO
      case 'create': {
        console.log(`📝 Creando documento: ${data.title}`);
        
        const { title, content, category, country, document_type, tags } = data;
        
        // Validar campos requeridos
        if (!title || !content || !category || !country || !document_type) {
          return res.status(400).json({
            success: false,
            error: 'Faltan campos requeridos: title, content, category, country, document_type'
          });
        }

        // Generar embedding
        let embeddingId = null;
        try {
          embeddingId = await embeddingService.generateEmbedding(content);
        } catch (error) {
          console.warn('⚠️ Error generando embedding:', error.message);
        }

        const doc = await databases.createDocument(
          databaseId,
          collectionId,
          'unique()',
          {
            title,
            content,
            summary: data.summary || content.substring(0, 500),
            category,
            subcategory: data.subcategory || '',
            tags: Array.isArray(tags) ? tags.join(',') : tags || '',
            country,
            jurisdiction: data.jurisdiction || '',
            document_type,
            author: data.author || '',
            date_published: data.date_published || new Date().toISOString(),
            embedding_id: embeddingId,
            status: 'active',
            version: 1,
            created_by: req.headers['x-user-id'] || 'admin',
            updatedAt: new Date().toISOString()
          }
        );

        return res.json({
          success: true,
          message: 'Documento creado exitosamente',
          document: doc
        });
      }

      // 📝 ACTUALIZAR DOCUMENTO
      case 'update': {
        console.log(`📝 Actualizando documento: ${data.documentId}`);
        
        const { documentId, ...updateData } = data;
        
        if (!documentId) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere documentId'
          });
        }

        // Si se actualiza el contenido, regenerar embedding
        if (updateData.content) {
          try {
            const embeddingId = await embeddingService.generateEmbedding(updateData.content);
            updateData.embedding_id = embeddingId;
          } catch (error) {
            console.warn('⚠️ Error regenerando embedding:', error.message);
          }
        }

        updateData.updatedAt = new Date().toISOString();
        if (updateData.tags && Array.isArray(updateData.tags)) {
          updateData.tags = updateData.tags.join(',');
        }

        const doc = await databases.updateDocument(
          databaseId,
          collectionId,
          documentId,
          updateData
        );

        return res.json({
          success: true,
          message: 'Documento actualizado exitosamente',
          document: doc
        });
      }

      // 🗑️ ELIMINAR DOCUMENTO
      case 'delete': {
        console.log(`🗑️ Eliminando documento: ${data.documentId}`);
        
        if (!data.documentId) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere documentId'
          });
        }

        await databases.deleteDocument(
          databaseId,
          collectionId,
          data.documentId
        );

        return res.json({
          success: true,
          message: 'Documento eliminado exitosamente'
        });
      }

      // 📋 LISTAR DOCUMENTOS
      case 'list': {
        console.log('📋 Listando documentos...');
        
        const limit = data.limit || 50;
        const offset = data.offset || 0;
        const filters = data.filters || [];
        const orderBy = data.orderBy || 'updatedAt';
        const orderType = data.orderType || 'desc';

        const docs = await databases.listDocuments(
          databaseId,
          collectionId,
          filters,
          limit,
          offset,
          orderBy,
          orderType
        );

        return res.json({
          success: true,
          documents: docs.documents,
          total: docs.total,
          limit,
          offset
        });
      }

      // 🔍 BUSCAR DOCUMENTOS
      case 'search': {
        console.log(`🔍 Buscando: ${data.query}`);
        
        const query = data.query || '';
        const country = data.country || '';
        const category = data.category || '';
        const limit = data.limit || 20;

        let filters = [`status == "active"`];
        
        if (country) {
          filters.push(`country == "${country}"`);
        }
        if (category) {
          filters.push(`category == "${category}"`);
        }
        if (query) {
          filters.push(`search(content, "${query}")`);
        }

        const results = await databases.listDocuments(
          databaseId,
          collectionId,
          filters,
          limit
        );

        return res.json({
          success: true,
          results: results.documents,
          total: results.total,
          query
        });
      }

      // 📥 IMPORTAR EN MASA
      case 'batch-import': {
        console.log(`📥 Importando ${data.documents?.length || 0} documentos...`);
        
        if (!data.documents || !Array.isArray(data.documents)) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere array de documentos'
          });
        }

        const results = [];
        for (const doc of data.documents) {
          try {
            const created = await databases.createDocument(
              databaseId,
              collectionId,
              'unique()',
              {
                ...doc,
                embedding_id: doc.content ? await embeddingService.generateEmbedding(doc.content) : null,
                created_by: req.headers['x-user-id'] || 'admin',
                updatedAt: new Date().toISOString(),
                status: 'active',
                version: 1
              }
            );
            results.push({ success: true, id: created.$id, title: doc.title });
          } catch (error) {
            results.push({ success: false, title: doc.title, error: error.message });
          }
        }

        return res.json({
          success: true,
          imported: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results
        });
      }

      // 📊 ESTADÍSTICAS DE CONOCIMIENTO
      case 'stats': {
        console.log('📊 Obteniendo estadísticas...');
        
        const total = await databases.listDocuments(
          databaseId,
          collectionId,
          [`status == "active"`],
          1
        );

        const byCategory = await databases.listDocuments(
          databaseId,
          collectionId,
          [],
          100
        );

        const categories = {};
        const countries = {};
        const types = {};

        for (const doc of byCategory.documents) {
          categories[doc.category] = (categories[doc.category] || 0) + 1;
          countries[doc.country] = (countries[doc.country] || 0) + 1;
          types[doc.document_type] = (types[doc.document_type] || 0) + 1;
        }

        return res.json({
          success: true,
          stats: {
            total: total.total,
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
    console.error('❌ Error en knowledge-manager:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};