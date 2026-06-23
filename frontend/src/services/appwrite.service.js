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
      
      const documentos = await this.buscarEnBaseDeDatos(question);
      
      if (documentos.length === 0) {
        return this.respuestaSinResultados(question);
      }
      
      const respuestaIA = await this.generarRespuestaConIA(question, documentos);
      
      try {
        await this.guardarHistorial(userId, question, respuestaIA);
      } catch (e) {
        console.warn('⚠️ No se pudo guardar historial:', e.message);
      }
      
      return {
        success: true,
        response: {
          text: respuestaIA,
          sources: documentos.slice(0, 3).map(doc => ({
            title: doc.Titulo || doc.titulo,
            category: doc.Categoria || doc.categoria,
            snippet: (doc.Contenido || doc.contenido || '').substring(0, 200)
          })),
          confidence: 0.9,
          category: documentos[0]?.Categoria || 'GENERAL',
          needsHuman: false,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('Error en chat:', error);
      return this.fallbackSinIA(question);
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
              Ultima_sesion: null
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
  // 🔍 BUSCAR EN BASE DE DATOS
  // ============================================================
  async buscarEnBaseDeDatos(question) {
    try {
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
      
      if (!response.ok) return [];
      
      const data = await response.json();
      const todos = data.documents || [];
      
      const questionLower = question.toLowerCase();
      const palabrasClave = questionLower
        .replace(/[¿?¡!.,;:]/g, '')
        .split(' ')
        .filter(p => p.length > 3);
      
      const relevantes = todos.map(doc => {
        const titulo = (doc.Titulo || doc.titulo || '').toLowerCase();
        const contenido = (doc.Contenido || doc.contenido || '').toLowerCase();
        const categoria = (doc.Categoria || doc.categoria || '').toLowerCase();
        
        let puntaje = 0;
        palabrasClave.forEach(palabra => {
          if (titulo.includes(palabra)) puntaje += 5;
          if (categoria.includes(palabra)) puntaje += 3;
          if (contenido.includes(palabra)) puntaje += 1;
        });
        
        if (questionLower.includes('asamblea') || questionLower.includes('convocar')) {
          if (categoria.includes('gobierno')) puntaje += 10;
          if (titulo.includes('asamblea')) puntaje += 15;
        }
        
        return { ...doc, puntaje };
      });
      
      return relevantes
        .filter(d => d.puntaje > 0)
        .sort((a, b) => b.puntaje - a.puntaje)
        .slice(0, 3);
      
    } catch (error) {
      console.error('Error buscando:', error);
      return [];
    }
  },

  // ============================================================
  // 🧠 GENERAR RESPUESTA CON DEEPSEEK
  // ============================================================
  async generarRespuestaConIA(question, documentos) {
    try {
      let contexto = '';
      documentos.forEach((doc, i) => {
        const titulo = doc.Titulo || doc.titulo || 'Documento';
        const contenido = doc.Contenido || doc.contenido || '';
        contexto += `\n[${i + 1}] FUENTE: ${titulo}\n`;
        contexto += `${contenido}\n`;
      });

      if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'tu-deepseek-api-key') {
        console.warn('⚠️ No hay API Key de DeepSeek. Usando fallback.');
        return this.respuestaSinIA(documentos, question);
      }

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
            {
              role: 'system',
              content: `Eres LEGAL-iCoop, un Asesor Legal Inteligente especializado en Derecho Cooperativo Latinoamericano.

INSTRUCCIONES:
1. Usa SOLO la información del contexto proporcionado.
2. Estructura tu respuesta de forma clara y práctica.
3. Incluye referencias a las fuentes (ej: [1]).
4. Responde en español con tono profesional pero accesible.
5. Si la información es insuficiente, indícalo claramente.

PRINCIPIOS:
- Precisión legal sobre todo
- Claridad para consejos directivos
- Contexto cooperativo siempre presente
- Recomienda consultar con abogado humano para casos complejos`
            },
            {
              role: 'user',
              content: `CONSULTA: ${question}\n\nCONTEXTO LEGAL:${contexto}\n\nResponde de forma clara, completa y práctica.`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error en DeepSeek:', response.status, errorData);
        return this.respuestaSinIA(documentos, question);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('❌ Error en IA:', error);
      return this.respuestaSinIA(documentos, question);
    }
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