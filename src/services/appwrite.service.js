// frontend/src/services/appwrite.service.js
// ✅ VERSIÓN COMPLETA - CON BÚSQUEDA DE USUARIO POR EMAIL

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://appwrite.muxiistudio.com/v1';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '6a38b6df001711622c4b';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '6a38d4a10015c8312dec';

const API_KEY = import.meta.env.VITE_APPWRITE_API_KEY || 'standard_216561a33a29b2e89dd5f94af3ef7ba8051eea692f580133f4126d989f077eec60ec91a80b0604dd412bf50d50ea133e64c725bc69fb8473f1003b03a19014a5de7f134d8f2f1f8b74e02966fa5e7a90d23168f161cfc17321c6a4904cfe3134174a352c978dfe76ec7edd821d4c98ac30ed44253ddbc35b3df2065536ae85b0';

// ✅ IDs de colecciones
const USERS_COLLECTION_ID = '6a38d58a003b4ccab913';
const CHAT_HISTORY_COLLECTION_ID = 'historial_de_chat';
const KNOWLEDGE_COLLECTION_ID = 'conocimiento_base';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-53dd7b237c854688aaf4c82f3956c9c0';

export const apiService = {
  // ============================================================
  // 📤 ENVIAR MENSAJE
  // ============================================================
  async sendChatMessage({ question, userId, useRAG = true }) {
    try {
      console.log('📤 Pregunta:', question);

      // ✅ Saludos → respuesta instantánea sin pegarle a la API
      const saludo = this.detectarSaludo(question);
      if (saludo) {
        return {
          success: true,
          response: {
            text: saludo,
            sources: [],
            confidence: 1,
            category: 'SALUDO',
            needsHuman: false,
            timestamp: new Date().toISOString()
          }
        };
      }

      // 🔍 Buscar contexto (opcional — DeepSeek responde igual)
      const documentos = await this.buscarEnBaseDeDatos(question);

      // 🧠 DeepSeek responde SIEMPRE, con contexto si hay, sin contexto si no
      const respuestaIA = await this.generarRespuestaConIA(question, documentos);

      // 💾 Guardar historial
      try {
        await this.guardarHistorial(userId, question, respuestaIA);
      } catch (e) {
        console.warn('⚠️ No se pudo guardar historial:', e.message);
      }

      const tieneDocs = documentos && documentos.length > 0;

      return {
        success: true,
        response: {
          text: respuestaIA,
          sources: tieneDocs
            ? documentos.slice(0, 3).map(doc => ({
                title: doc.Titulo || doc.titulo,
                category: doc.Categoria || doc.categoria,
                snippet: (doc.Contenido || doc.contenido || '').substring(0, 200)
              }))
            : [],
          confidence: tieneDocs ? 0.9 : 0.6,
          category: tieneDocs ? (documentos[0]?.Categoria || 'GENERAL') : 'GENERAL',
          needsHuman: !tieneDocs,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error en chat:', error);
      return {
        success: true,
        response: {
          text: this.respuestaSinResultados(question),
          sources: [],
          confidence: 0.3,
          category: 'GENERAL',
          needsHuman: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  // ============================================================
  // 💾 GUARDAR HISTORIAL
  // ============================================================
  async guardarHistorial(userId, question, response) {
    try {
      console.log('💾 Guardando historial...');
      
      const result = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${CHAT_HISTORY_COLLECTION_ID}/documents`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          },
          body: JSON.stringify({
            documentId: 'unique()',
            data: {
              usuarios: userId,
              Pregunta: question,
              Respuesta: response,
              Hora_realizacion: new Date().toISOString()
            }
          })
        }
      );

      if (!result.ok) {
        const errorText = await result.text();
        console.error('❌ Error guardando historial:', result.status, errorText);
        return false;
      }

      console.log('✅ Historial guardado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en guardarHistorial:', error);
      return false;
    }
  },

  // ============================================================
  // 📖 OBTENER HISTORIAL
  // ============================================================
  async obtenerHistorial(userId, limit = 50) {
    try {
      console.log('📖 Obteniendo historial para:', userId);

      const response = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${CHAT_HISTORY_COLLECTION_ID}/documents`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          }
        }
      );

      if (!response.ok) {
        console.warn('⚠️ No se pudo obtener historial:', response.status);
        return { success: false, history: [] };
      }

      const data = await response.json();
      const docs = data.documents || [];

      // Filtrar por usuario y ordenar cronológicamente
      const historial = docs
        .filter(doc => doc.usuarios === userId)
        .sort((a, b) => new Date(a.Hora_realizacion) - new Date(b.Hora_realizacion))
        .slice(-limit);

      // Convertir a formato mensajes
      const messages = [];
      historial.forEach(doc => {
        messages.push({
          id: `hist-${doc.$id}-q`,
          sender: 'user',
          text: doc.Pregunta,
          timestamp: doc.Hora_realizacion
        });
        messages.push({
          id: `hist-${doc.$id}-a`,
          sender: 'bot',
          text: doc.Respuesta,
          timestamp: doc.Hora_realizacion
        });
      });

      console.log(`✅ Historial cargado: ${messages.length} mensajes`);
      return { success: true, history: messages };

    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      return { success: false, history: [] };
    }
  },

  // Alias para compatibilidad con chat.service.js
  getChatHistory(userId, limit) {
    return this.obtenerHistorial(userId, limit);
  },

  // ============================================================
  // 🔢 LÍMITES DE MENSAJES
  // ============================================================
  async obtenerLimitesMensajes(userId) {
    try {
      const response = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${USERS_COLLECTION_ID}/documents/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          }
        }
      );

      if (!response.ok) return { mensajes_enviados: 0, limite_mensajes: 10 };

      const doc = await response.json();
      return {
        mensajes_enviados: doc.mensajes_enviados || 0,
        limite_mensajes: doc.limite_mensajes ?? 10
      };
    } catch (error) {
      console.error('❌ Error obteniendo límites:', error);
      return { mensajes_enviados: 0, limite_mensajes: 10 };
    }
  },

  async incrementarContadorMensajes(userId) {
    try {
      const limites = await this.obtenerLimitesMensajes(userId);
      const nuevosEnviados = (limites.mensajes_enviados || 0) + 1;

      const response = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${USERS_COLLECTION_ID}/documents/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          },
          body: JSON.stringify({
            data: {
              mensajes_enviados: nuevosEnviados
            }
          })
        }
      );

      if (!response.ok) {
        console.warn('⚠️ No se pudo incrementar contador:', await response.text());
        return false;
      }

      console.log(`✅ Contador incrementado: ${nuevosEnviados}`);
      return true;
    } catch (error) {
      console.error('❌ Error incrementando contador:', error);
      return false;
    }
  },

  async actualizarLimiteMensajes(userId, nuevoLimite) {
    try {
      const limite = Math.max(1, Math.min(1000, parseInt(nuevoLimite) || 10));

      const response = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${USERS_COLLECTION_ID}/documents/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          },
          body: JSON.stringify({
            data: {
              limite_mensajes: limite
            }
          })
        }
      );

      if (!response.ok) {
        console.error('❌ Error actualizando límite:', await response.text());
        return { success: false };
      }

      console.log(`✅ Límite actualizado a ${limite}`);
      return { success: true, limite };
    } catch (error) {
      console.error('❌ Error actualizando límite:', error);
      return { success: false };
    }
  },

  // ============================================================
  // 👥 USUARIOS - LISTAR
  // ============================================================
  async listarUsuarios() {
    try {
      console.log('📋 Listando usuarios...');
      
      const response = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${USERS_COLLECTION_ID}/documents`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error listando usuarios:', response.status, errorText);
        return { success: false, users: [] };
      }

      const data = await response.json();
      console.log('✅ Usuarios encontrados:', data.documents?.length || 0);
      return { success: true, users: data.documents || [] };
    } catch (error) {
      console.error('❌ Error listando usuarios:', error);
      return { success: false, users: [] };
    }
  },

  // ============================================================
  // 👤 USUARIOS - REGISTRAR (CON AUTH DE APPWRITE)
  // ============================================================
  async registrarUsuario(userData) {
    try {
      console.log('📝 Registrando usuario en Auth y DB...');
      console.log('📧 Email:', userData.email);
      
      // 1️⃣ CREAR USUARIO EN AUTH DE APPWRITE
      const authResponse = await fetch(
        `${APPWRITE_ENDPOINT}/account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID
          },
          body: JSON.stringify({
            userId: 'unique()',
            email: userData.email,
            password: userData.password,
            name: userData.name
          })
        }
      );

      if (!authResponse.ok) {
        const error = await authResponse.json();
        console.error('❌ Error en Auth:', error);
        return { success: false, error: error.message || 'Error al crear usuario en Auth' };
      }

      const authData = await authResponse.json();
      console.log('✅ Usuario creado en Auth:', authData.$id);

      // 2️⃣ CREAR DOCUMENTO EN LA COLECCIÓN "Usuarios"
      const dbResponse = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${USERS_COLLECTION_ID}/documents`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          },
          body: JSON.stringify({
            documentId: authData.$id,
            data: {
              Nombre: userData.name,
              Email: userData.email,
              Rol: userData.role || 'user',
              Verificado: false,
              Created_by: 'system',
              Ultima_sesion: null,
              mensajes_enviados: 0,
              limite_mensajes: 10
            }
          })
        }
      );

      if (!dbResponse.ok) {
        const error = await dbResponse.text();
        console.error('❌ Error en DB:', error);
        return { 
          success: false, 
          error: 'Usuario creado en Auth pero no en DB',
          authId: authData.$id
        };
      }

      console.log('✅ Usuario registrado completamente');
      return { 
        success: true, 
        message: 'Usuario registrado exitosamente', 
        userId: authData.$id 
      };

    } catch (error) {
      console.error('❌ Error registrando usuario:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================
  // 🔐 INICIAR SESIÓN - CORREGIDO (BUSCA POR EMAIL)
  // ============================================================
  async login(email, password) {
    try {
      console.log('🔐 Iniciando sesión...');
      console.log('📧 Email:', email);
      
      // 1️⃣ CREAR SESIÓN EN APPWRITE
      const sessionResponse = await fetch(
        `${APPWRITE_ENDPOINT}/account/sessions/email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      if (!sessionResponse.ok) {
        const error = await sessionResponse.json();
        console.error('❌ Error en login:', error);
        return { success: false, error: error.message || 'Credenciales inválidas' };
      }

      const sessionData = await sessionResponse.json();
      console.log('✅ Sesión creada:', sessionData.$id);

      // 2️⃣ OBTENER DATOS DEL USUARIO DESDE AUTH
      const userResponse = await fetch(
        `${APPWRITE_ENDPOINT}/users/${sessionData.userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          }
        }
      );

      if (!userResponse.ok) {
        const error = await userResponse.json();
        console.error('❌ Error obteniendo usuario:', error);
        return { success: false, error: 'Error al obtener datos del usuario' };
      }

      const authUser = await userResponse.json();
      console.log('✅ Usuario autenticado:', authUser.email);

      // 3️⃣ BUSCAR EN DB POR EMAIL (NO POR ID)
      const dbResponse = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${USERS_COLLECTION_ID}/documents`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          }
        }
      );

      let dbUser = null;
      let role = 'user';

      if (dbResponse.ok) {
        const data = await dbResponse.json();
        // ✅ Buscar por email
        dbUser = data.documents.find(doc => doc.Email === authUser.email);
        
        if (dbUser) {
          role = dbUser.Rol || 'user';
          console.log('✅ Usuario encontrado en DB por email, rol:', role);
          console.log('📋 DB User ID:', dbUser.$id);
          console.log('📊 Mensajes:', dbUser.mensajes_enviados || 0, '/', dbUser.limite_mensajes || 10);
        } else {
          console.warn('⚠️ Usuario no encontrado en DB por email');
        }
      }

      // 4️⃣ DEVOLVER DATOS DEL USUARIO
      return {
        success: true,
        user: {
          $id: dbUser ? dbUser.$id : authUser.$id,
          email: authUser.email,
          name: authUser.name,
          role: role.toLowerCase(),
          verified: authUser.emailVerification || false,
          mensajes_enviados: dbUser?.mensajes_enviados || 0,
          limite_mensajes: dbUser?.limite_mensajes ?? 10,
          dbUser: dbUser,
          sessionId: sessionData.$id,
          authUserId: sessionData.userId
        }
      };

    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================
  // 🚪 CERRAR SESIÓN
  // ============================================================
  async logout() {
    try {
      const response = await fetch(
        `${APPWRITE_ENDPOINT}/account/sessions/current`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        console.warn('⚠️ Error al cerrar sesión:', await response.text());
        return { success: false };
      }

      console.log('✅ Sesión cerrada');
      return { success: true };
    } catch (error) {
      console.error('❌ Error en logout:', error);
      return { success: false };
    }
  },

  // ============================================================
  // 🗑️ USUARIOS - ELIMINAR
  // ============================================================
  async eliminarUsuario(userId) {
    try {
      console.log('🗑️ Eliminando usuario:', userId);
      
      // 1️⃣ ELIMINAR DE AUTH
      const authResponse = await fetch(
        `${APPWRITE_ENDPOINT}/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          }
        }
      );

      if (!authResponse.ok) {
        console.warn('⚠️ No se pudo eliminar de Auth:', await authResponse.text());
      }

      // 2️⃣ ELIMINAR DE DB
      const dbResponse = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${USERS_COLLECTION_ID}/documents/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          }
        }
      );

      if (!dbResponse.ok) {
        return { success: false, error: 'Error al eliminar de DB' };
      }

      console.log('✅ Usuario eliminado');
      return { success: true };
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================
  // 🔍 BUSCAR EN BASE DE DATOS - VERSIÓN MEJORADA AL 100%
  // ============================================================
  async buscarEnBaseDeDatos(question) {
    try {
      console.log('🔍 Buscando en base de conocimiento:', question);
      
      const response = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${KNOWLEDGE_COLLECTION_ID}/documents`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
          }
        }
      );
      
      if (!response.ok) {
        console.warn('⚠️ Error al obtener documentos:', response.status);
        return [];
      }
      
      const data = await response.json();
      const todos = data.documents || [];
      
      if (todos.length === 0) {
        console.log('📭 No hay documentos en la base de conocimiento');
        return [];
      }
      
      const questionLower = question.toLowerCase();
      
      // 🔑 Extraer palabras clave de la pregunta
      const palabrasClave = questionLower
        .replace(/[¿?¡!.,;:()"']/g, '')
        .split(' ')
        .filter(p => p.length > 2);
      
      console.log(`📋 Palabras clave: ${palabrasClave.join(', ')}`);
      
      // 🎯 MAPA DE CATEGORÍAS Y SUS PALABRAS CLAVE
      const categoriasMap = {
        'Legislación cooperativa': ['ley', 'artículo', 'norma', 'decreto', 'circular', 'constitución', 'código', 'legal', 'legislación', 'estatuto', 'reglamento'],
        'Gobierno cooperativo': ['asamblea', 'consejo', 'directivo', 'elección', 'voto', 'democrático', 'control', 'gobierno', 'administración', 'gestión'],
        'Derechos de asociados': ['derecho', 'asociado', 'obligación', 'exclusión', 'retiro', 'participación', 'miembro', 'socio'],
        'Protección de datos': ['datos', 'protección', 'privacidad', 'personal', 'seguridad', 'consentimiento', 'información'],
        'Estatutos modelo': ['estatuto', 'reglamento', 'modelo', 'estructura', 'organización', 'norma interna'],
        'Fusiones y reestructuración': ['fusión', 'absorción', 'integración', 'liquidación', 'reestructuración', 'disolución'],
        'Normativa laboral': ['laboral', 'trabajo', 'contrato', 'empleado', 'salario', 'prestación', 'ocupacional'],
        'Responsabilidad legal': ['responsabilidad', 'riesgo', 'seguro', 'sanción', 'penal', 'civil', 'legal']
      };
      
      // 🔍 DETECTAR CATEGORÍA PROBABLE
      let categoriaProbable = null;
      let maxCoincidencias = 0;
      
      for (const [categoria, palabras] of Object.entries(categoriasMap)) {
        let coincidencias = 0;
        for (const palabra of palabras) {
          if (questionLower.includes(palabra)) {
            coincidencias++;
          }
        }
        if (coincidencias > maxCoincidencias) {
          maxCoincidencias = coincidencias;
          categoriaProbable = categoria;
        }
      }
      
      if (categoriaProbable) {
        console.log(`🎯 Categoría probable: ${categoriaProbable} (${maxCoincidencias} coincidencias)`);
      }
      
      // 📊 CALCULAR PUNTAJE DE CADA DOCUMENTO
      const resultados = todos.map(doc => {
        const titulo = (doc.Titulo || doc.titulo || '').toLowerCase();
        const contenido = (doc.Contenido || doc.contenido || '').toLowerCase();
        const categoria = (doc.Categoria || doc.categoria || '').toLowerCase();
        const resumen = (doc.Resumen || doc.resumen || '').toLowerCase();
        const etiquetas = (doc.Etiquetas || doc.etiquetas || '').toLowerCase();
        
        let puntaje = 0;
        
        // 🔥 PESO 1: Título (muy importante)
        for (const palabra of palabrasClave) {
          if (titulo.includes(palabra)) {
            puntaje += 15;
          }
        }
        
        // 🔥 PESO 2: Coincidencia exacta en título (muy valioso)
        for (const palabra of palabrasClave) {
          if (titulo.includes(palabra) && palabra.length > 4) {
            puntaje += 10;
          }
        }
        
        // 🔥 PESO 3: Categoría (valioso)
        for (const palabra of palabrasClave) {
          if (categoria.includes(palabra)) {
            puntaje += 8;
          }
        }
        
        // 🔥 PESO 4: Resumen
        for (const palabra of palabrasClave) {
          if (resumen.includes(palabra)) {
            puntaje += 5;
          }
        }
        
        // 🔥 PESO 5: Etiquetas
        for (const palabra of palabrasClave) {
          if (etiquetas.includes(palabra)) {
            puntaje += 4;
          }
        }
        
        // 🔥 PESO 6: Contenido (menos peso porque es muy extenso)
        for (const palabra of palabrasClave) {
          if (contenido.includes(palabra)) {
            puntaje += 2;
          }
        }
        
        // 🔥 PESO 7: Bonificación si la pregunta contiene "fondo" o "social"
        if (questionLower.includes('fondo') || questionLower.includes('social') || questionLower.includes('educación') || questionLower.includes('solidaridad')) {
          if (titulo.includes('fondo') || titulo.includes('social') || titulo.includes('educación') || titulo.includes('solidaridad') || titulo.includes('circular')) {
            puntaje += 30;
          }
          if (contenido.includes('fondo de educación') || contenido.includes('fondo de solidaridad')) {
            puntaje += 40;
          }
          if (categoria.includes('legislación')) {
            puntaje += 15;
          }
        }
        
        // 🔥 PESO 8: Bonificación si la pregunta contiene "asamblea"
        if (questionLower.includes('asamblea') || questionLower.includes('convocar') || questionLower.includes('convocatoria')) {
          if (categoria.includes('gobierno')) puntaje += 10;
          if (titulo.includes('asamblea')) puntaje += 15;
        }
        
        // 🔥 PESO 9: Bonificación por categoría probable
        if (categoriaProbable && categoria.includes(categoriaProbable.toLowerCase())) {
          puntaje += 20;
        }
        
        // 🔥 PESO 10: Palabras clave únicas en contenido (aparecen pocas veces)
        let palabrasUnicas = 0;
        for (const palabra of palabrasClave) {
          const count = (contenido.match(new RegExp(palabra, 'g')) || []).length;
          if (count > 0) palabrasUnicas++;
        }
        if (palabrasUnicas === palabrasClave.length && palabrasUnicas > 0) {
          puntaje += 15; // Todas las palabras clave aparecen en el contenido
        }
        
        return { ...doc, puntaje };
      });
      
      // 📊 FILTRAR Y ORDENAR
      let filtrados = resultados.filter(d => d.puntaje > 0);
      
      // ⚠️ Si no hay resultados con puntaje, buscar por categoría
      if (filtrados.length === 0 && categoriaProbable) {
        console.log(`🔍 Buscando por categoría: ${categoriaProbable}`);
        filtrados = resultados.filter(d => {
          const cat = (d.Categoria || d.categoria || '').toLowerCase();
          return cat.includes(categoriaProbable.toLowerCase());
        });
      }
      
      // ⚠️ Si aún no hay resultados, buscar en títulos que contengan palabras clave
      if (filtrados.length === 0) {
        console.log('🔍 Buscando por coincidencia en título');
        filtrados = resultados.filter(d => {
          const titulo = (d.Titulo || d.titulo || '').toLowerCase();
          return palabrasClave.some(p => titulo.includes(p));
        });
      }
      
      // Ordenar por puntaje y tomar los mejores
      const finales = filtrados
        .sort((a, b) => b.puntaje - a.puntaje)
        .slice(0, 5);
      
      console.log(`✅ Resultados: ${finales.length} documentos encontrados`);
      finales.forEach(d => {
        console.log(`  - ${d.Titulo || d.titulo} (puntaje: ${d.puntaje})`);
      });
      
      return finales;
      
    } catch (error) {
      console.error('❌ Error en buscarEnBaseDeDatos:', error);
      return [];
    }
  },

  // ============================================================
  // 🧠 GENERAR RESPUESTA CON DEEPSEEK (CON O SIN CONTEXTO)
  // ============================================================
  async generarRespuestaConIA(question, documentos) {
    try {
      const tieneDocs = documentos && documentos.length > 0;

      // Construir contexto SOLO si hay documentos en la base de conocimiento
      let contexto = '';
      if (tieneDocs) {
        documentos.forEach((doc, i) => {
          const titulo = doc.Titulo || doc.titulo || 'Documento';
          const contenido = doc.Contenido || doc.contenido || '';
          contexto += `\n[${i + 1}] FUENTE: ${titulo}\n`;
          contexto += `${contenido}\n`;
        });
      }

      // Sin API key → fallback local
      if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'tu-deepseek-api-key') {
        console.warn('⚠️ No hay API Key de DeepSeek. Usando fallback.');
        if (tieneDocs) return this.respuestaSinIA(documentos, question);
        return this.respuestaSinResultados(question);
      }

      // System prompt adaptativo: con o sin contexto
      const systemPrompt = tieneDocs
        ? `Eres LEGAL-iCoop, un Asesor Legal Inteligente especializado en Derecho Cooperativo Latinoamericano.

INSTRUCCIONES:
1. Usa SOLO la información del contexto proporcionado.
2. Estructura tu respuesta de forma clara y práctica.
3. Incluye referencias a las fuentes (ej: [1]).
4. Responde en español con tono profesional pero accesible.
5. Si la información del contexto es insuficiente, indícalo claramente.

PRINCIPIOS:
- Precisión legal sobre todo
- Claridad para consejos directivos
- Contexto cooperativo siempre presente
- Recomienda consultar con abogado humano para casos complejos`
        : `Eres LEGAL-iCoop, un Asesor Legal Inteligente especializado en Derecho Cooperativo Latinoamericano.

INSTRUCCIONES:
1. Responde en español con tono profesional pero accesible.
2. Basa tu respuesta en tu conocimiento sobre derecho cooperativo.
3. Si no tienes información suficiente sobre el tema, indícalo claramente y sugiere consultar con un asesor legal humano.
4. Siempre aclara que la información es orientativa y no reemplaza la asesoría legal profesional.

PRINCIPIOS:
- Precisión legal sobre todo
- Claridad para consejos directivos
- Contexto cooperativo siempre presente`;

      const userContent = tieneDocs
        ? `CONSULTA: ${question}\n\nCONTEXTO LEGAL:${contexto}\n\nResponde de forma clara, completa y práctica usando SOLO la información del contexto. Si el contexto no es suficiente para responder, indícalo.`
        : `CONSULTA: ${question}\n\nResponde basándote en tu conocimiento general sobre derecho cooperativo. Si no tienes información suficiente, indícalo claramente y sugiere consultar con un abogado especializado.`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          temperature: 0.3,
          max_tokens: 800,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error en DeepSeek:', response.status, errorData);
        if (tieneDocs) return this.respuestaSinIA(documentos, question);
        return this.respuestaSinResultados(question);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('❌ Error en IA:', error);
      if (documentos && documentos.length > 0) return this.respuestaSinIA(documentos, question);
      return this.respuestaSinResultados(question);
    }
  },

  // ============================================================
  // 👋 DETECTAR SALUDOS
  // ============================================================
  detectarSaludo(texto) {
    const saludos = [
      'hola', 'buen', 'buenas', 'buenos', 'hey', 'hi', 'hello',
      'saludos', 'qué tal', 'que tal', 'como estas', 'cómo estás',
      'como está', 'cómo está', 'buen día', 'buen dia',
      'buenas tardes', 'buenas noches', 'buenos días', 'buenos dias'
    ];

    const textoLower = texto.toLowerCase().trim().replace(/[¿?!¡.,;:]/g, '');

    for (const saludo of saludos) {
      if (textoLower === saludo || textoLower.startsWith(saludo + ' ')) {
        return '👋 ¡Hola! Soy LEGAL-iCoop, tu Asesor Legal Inteligente en Derecho Cooperativo.\n\n¿En qué puedo ayudarte hoy? Puedes preguntarme sobre:\n• Requisitos legales para cooperativas\n• Derechos y obligaciones de los asociados\n• Procedimientos de asambleas y convocatorias\n• Normativa cooperativa vigente\n• Fusión, liquidación y transformación de cooperativas\n\nO simplemente escribe tu consulta legal y la responderé usando nuestra base de conocimiento.';
      }
    }

    return null;
  },

  // ============================================================
  // 📝 FALLBACK: Respuesta sin IA
  // ============================================================
  respuestaSinIA(documentos, question) {
    const doc = documentos[0];
    const titulo = doc.Titulo || doc.titulo || 'Documento';
    const contenido = doc.Contenido || doc.contenido || '';
    
    const questionLower = question.toLowerCase();
    const keywords = questionLower.split(' ').filter(p => p.length > 3);
    const parrafos = contenido.split('\n\n');
    
    const relevantes = parrafos.filter(p => {
      const pLower = p.toLowerCase();
      return keywords.some(k => pLower.includes(k));
    });
    
    const secciones = relevantes.length > 0 ? relevantes : parrafos.slice(0, 3);
    
    let respuesta = `📚 **${titulo}**\n\n`;
    secciones.forEach(seccion => {
      const texto = seccion.trim();
      if (texto.length > 10) {
        respuesta += `${texto}\n\n`;
      }
    });
    
    respuesta += `\n📌 **Fuente:** ${titulo}`;
    respuesta += `\n⚖️ Esta información es orientativa. Consulta siempre con un asesor legal.`;
    
    return respuesta;
  },

  // ============================================================
  // ❌ Sin resultados
  // ============================================================
  respuestaSinResultados(question) {
    return `📚 No encontré información específica sobre "${question}" en mi base de conocimiento.\n\nTe recomiendo:\n1. Reformular tu pregunta\n2. Consultar la documentación legal\n3. Contactar con un asesor legal especializado`;
  },

  // ============================================================
  // 🔄 Fallback general
  // ============================================================
  fallbackSinIA(question) {
    return this.respuestaSinResultados(question);
  }
};