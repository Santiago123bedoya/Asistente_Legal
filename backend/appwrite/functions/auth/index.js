// backend/appwrite/functions/auth/index.js
// Función de autenticación y gestión de usuarios (Solo Admin)

const { Client, Users, Databases } = require('node-appwrite');

module.exports = async function(req, res) {
  console.log('🔐 Iniciando función de autenticación...');

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);

  const { action, data } = req.body;
  const userRole = req.headers['x-user-role'] || 'user';

  // 🔐 Verificar que solo admin pueda realizar acciones administrativas
  const adminActions = ['register-user', 'verify-user', 'list-users', 'update-user-role', 'delete-user'];
  
  if (adminActions.includes(action) && userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Solo administradores pueden realizar esta acción.'
    });
  }

  try {
    switch(action) {
      // 👤 REGISTRAR USUARIO (SOLO ADMIN)
      case 'register-user': {
        console.log(`📝 Registrando usuario: ${data.email}`);
        
        // Validar datos
        if (!data.email || !data.password || !data.name) {
          return res.status(400).json({
            success: false,
            error: 'Faltan datos requeridos: email, password, name'
          });
        }

        // Crear usuario en Appwrite Auth
        const newUser = await users.create(
          data.email,
          data.password,
          data.name
        );

        // Actualizar metadatos del usuario
        await users.update(
          newUser.$id,
          newUser.email,
          newUser.name,
          {
            role: data.role || 'user',
            cooperative: data.cooperative || '',
            verified: false,
            created_by: req.headers['x-user-id'] || 'admin'
          }
        );

        // Crear registro en la colección de usuarios
        await databases.createDocument(
          process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db',
          'users',
          newUser.$id,
          {
            name: data.name,
            email: data.email,
            role: data.role || 'user',
            cooperative: data.cooperative || '',
            verified: false,
            created_by: req.headers['x-user-id'] || 'admin',
            created_at: new Date().toISOString()
          }
        );

        console.log(`✅ Usuario registrado: ${newUser.$id}`);
        
        return res.json({
          success: true,
          message: 'Usuario registrado exitosamente',
          userId: newUser.$id,
          user: {
            id: newUser.$id,
            email: newUser.email,
            name: newUser.name,
            role: data.role || 'user'
          }
        });
      }

      // ✅ VERIFICAR USUARIO (SOLO ADMIN)
      case 'verify-user': {
        console.log(`✅ Verificando usuario: ${data.userId}`);
        
        if (!data.userId) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere userId'
          });
        }

        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db',
          'users',
          data.userId,
          { 
            verified: true,
            verified_at: new Date().toISOString()
          }
        );

        return res.json({
          success: true,
          message: 'Usuario verificado exitosamente'
        });
      }

      // 📋 LISTAR USUARIOS (SOLO ADMIN)
      case 'list-users': {
        console.log('📋 Listando usuarios...');
        
        const limit = data.limit || 100;
        const offset = data.offset || 0;
        
        const usersList = await databases.listDocuments(
          process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db',
          'users',
          [],
          limit,
          offset
        );

        return res.json({
          success: true,
          users: usersList.documents,
          total: usersList.total,
          limit,
          offset
        });
      }

      // 🔄 ACTUALIZAR ROL (SOLO ADMIN)
      case 'update-user-role': {
        console.log(`🔄 Actualizando rol de usuario: ${data.userId}`);
        
        if (!data.userId || !data.newRole) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere userId y newRole'
          });
        }

        // Validar rol
        const validRoles = ['admin', 'user', 'editor'];
        if (!validRoles.includes(data.newRole)) {
          return res.status(400).json({
            success: false,
            error: `Rol inválido. Debe ser: ${validRoles.join(', ')}`
          });
        }

        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db',
          'users',
          data.userId,
          { 
            role: data.newRole,
            role_updated_at: new Date().toISOString()
          }
        );

        // También actualizar en Auth
        try {
          const user = await users.get(data.userId);
          await users.update(
            data.userId,
            user.email,
            user.name,
            { role: data.newRole }
          );
        } catch (error) {
          console.warn('⚠️ No se pudo actualizar rol en Auth:', error.message);
        }

        return res.json({
          success: true,
          message: 'Rol actualizado exitosamente',
          userId: data.userId,
          newRole: data.newRole
        });
      }

      // 🗑️ ELIMINAR USUARIO (SOLO ADMIN)
      case 'delete-user': {
        console.log(`🗑️ Eliminando usuario: ${data.userId}`);
        
        if (!data.userId) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere userId'
          });
        }

        // Eliminar de Auth
        await users.delete(data.userId);
        
        // Eliminar de la colección
        await databases.deleteDocument(
          process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db',
          'users',
          data.userId
        );

        return res.json({
          success: true,
          message: 'Usuario eliminado exitosamente'
        });
      }

      // 📊 OBTENER ESTADÍSTICAS (SOLO ADMIN)
      case 'get-stats': {
        console.log('📊 Obteniendo estadísticas...');
        
        const totalUsers = await databases.listDocuments(
          process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db',
          'users'
        );

        const admins = totalUsers.documents.filter(u => u.role === 'admin');
        const verified = totalUsers.documents.filter(u => u.verified);

        return res.json({
          success: true,
          stats: {
            total: totalUsers.total,
            admins: admins.length,
            verified: verified.length,
            pending: totalUsers.total - verified.length
          }
        });
      }

      // 👤 OBTENER PERFIL DE USUARIO
      case 'get-profile': {
        console.log(`👤 Obteniendo perfil de usuario: ${data.userId}`);
        
        if (!data.userId) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere userId'
          });
        }

        const userDoc = await databases.getDocument(
          process.env.APPWRITE_DATABASE_ID || 'legal_icoop_db',
          'users',
          data.userId
        );

        return res.json({
          success: true,
          user: userDoc
        });
      }

      default:
        return res.status(400).json({
          success: false,
          error: `Acción no válida: ${action}`
        });
    }

  } catch (error) {
    console.error('❌ Error en auth function:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};