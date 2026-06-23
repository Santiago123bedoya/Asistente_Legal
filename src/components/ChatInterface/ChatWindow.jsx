// src/components/ChatInterface/ChatWindow.jsx
// 💬 Chat para usuarios normales - Con datos del usuario actual

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, MessageSquare, User, Bot, Sparkles, 
  LogOut, Menu, X, ChevronDown, HelpCircle, Trash2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../../services/appwrite.service';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ 
  userId, userRole, onLogout, isAdminMode = false, userData = null,
  mensajesEnviados: initialMensajes = 0, limiteMensajes: initialLimite = 10 
}) => {
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mensajesEnviados, setMensajesEnviados] = useState(initialMensajes);
  const [limiteMensajes] = useState(initialLimite);
  const [showModalLimite, setShowModalLimite] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const historyLoadedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const mensajesRestantes = Math.max(0, limiteMensajes - mensajesEnviados);

  // ✅ Obtener datos del usuario de manera segura
  // Primero de userData, luego de localStorage, luego valores por defecto
  const getUserData = () => {
    // Si se pasó userData como prop, usarlo
    if (userData) {
      return {
        name: userData.name || userData.Nombre || 'Usuario',
        email: userData.email || 'usuario@email.com',
        role: userData.role || 'user'
      };
    }
    
    // Si no, intentar obtener de localStorage
    try {
      const saved = localStorage.getItem('legal_icoop_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || parsed.Nombre || 'Usuario',
          email: parsed.email || 'usuario@email.com',
          role: parsed.role || 'user'
        };
      }
    } catch (e) {
      console.warn('⚠️ Error al leer usuario de localStorage:', e);
    }
    
    // Valores por defecto
    return {
      name: 'Usuario',
      email: 'usuario@email.com',
      role: 'user'
    };
  };

  const userInfo = getUserData();
  const userName = userInfo.name;
  const userEmail = userInfo.email;
  const userInitial = userName?.charAt(0)?.toUpperCase() || 'U';

  // 💾 Cargar historial al montar el componente
  useEffect(() => {
    if (!userId || historyLoadedRef.current) return;
    historyLoadedRef.current = true;

    const cargarHistorial = async () => {
      setLoadingHistory(true);
      try {
        const response = await apiService.obtenerHistorial(userId);
        if (response.success && response.history?.length > 0) {
          setMessages(prev => [...response.history, ...prev]);
        } else {
          // Sin historial → mensaje de bienvenida
          setMessages([{
            id: 'welcome',
            sender: 'bot',
            text: '👋 ¡Hola! Soy LEGAL-iCoop, tu Asesor Legal Inteligente en Derecho Cooperativo.\n\n¿En qué puedo ayudarte hoy?',
            timestamp: new Date().toISOString()
          }]);
        }
      } catch (e) {
        console.warn('⚠️ Error cargando historial:', e);
        setMessages([{
          id: 'welcome',
          sender: 'bot',
          text: '👋 ¡Hola! Soy LEGAL-iCoop, tu Asesor Legal Inteligente en Derecho Cooperativo.\n\n¿En qué puedo ayudarte hoy?',
          timestamp: new Date().toISOString()
        }]);
      } finally {
        setLoadingHistory(false);
      }
    };

    cargarHistorial();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // ✅ Verificar límite de mensajes
    if (mensajesRestantes <= 0) {
      setShowModalLimite(true);
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage({
        question: input,
        userId,
        useRAG: true
      });

      if (response.success) {
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: response.response.text,
          sources: response.response.sources || [],
          timestamp: new Date().toISOString()
        }]);

        // ✅ Incrementar contador en Appwrite
        const nuevoTotal = mensajesEnviados + 1;
        setMensajesEnviados(nuevoTotal);
        apiService.incrementarContadorMensajes(userId);

        // ✅ Actualizar localStorage
        try {
          const saved = localStorage.getItem('legal_icoop_user');
          if (saved) {
            const userData_ = JSON.parse(saved);
            userData_.mensajes_enviados = nuevoTotal;
            localStorage.setItem('legal_icoop_user', JSON.stringify(userData_));
          }
        } catch (e) {
          console.warn('⚠️ No se pudo actualizar localStorage:', e);
        }
      } else {
        setMessages(prev => [...prev, {
          id: `error-${Date.now()}`,
          sender: 'system',
          text: '❌ Error al procesar tu consulta. Por favor, intenta de nuevo.',
          type: 'error',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'system',
        text: '❌ Error de conexión. Verifica tu conexión e intenta de nuevo.',
        type: 'error',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    setShowClearConfirm(false);

    try {
      const saved = localStorage.getItem('legal_icoop_user');
      if (saved) {
        const userData_ = JSON.parse(saved);
        // ✅ NO resetear mensajes_enviados — solo limpia la UI
        localStorage.setItem('legal_icoop_user', JSON.stringify(userData_));
      }
    } catch (e) {
      console.warn('⚠️ Error al limpiar chat:', e);
    }
  };

  const handleCloseModal = () => {
    setShowModalLimite(false);
  };

  const suggestions = [
    '¿Cuáles son los requisitos para mantener el control democrático?',
    '¿Qué límites existen para la externalización de funciones?',
    '¿Cómo proteger los datos de los asociados?',
    '¿Qué procedimiento seguir para una fusión?'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* ============================================================
      SIDEBAR PARA USUARIO NORMAL
      ============================================================ */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              ⚖️
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">LEGAL-iCoop</h1>
              <p className="text-xs text-gray-500">Asesor Legal IA</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* ✅ Perfil del usuario con sus datos reales */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
            >
              <MessageSquare size={20} />
              <span className="text-sm font-medium">Chat Legal</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
          {/* 📊 Contador de mensajes */}
          <div className={`px-4 py-2.5 rounded-xl text-xs font-medium ${
            mensajesRestantes <= 3 
              ? 'bg-red-50 text-red-600 border border-red-200' 
              : 'bg-gray-50 text-gray-500 border border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <span>📊 Mensajes disponibles</span>
              <span className="font-bold">{mensajesRestantes}/{limiteMensajes}</span>
            </div>
          </div>

          {/* 🗑️ Limpiar chat */}
          {messages.length > 1 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Trash2 size={18} />
              <span className="text-sm font-medium">Limpiar Chat</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      {/* ============================================================
      CONTENIDO PRINCIPAL
      ============================================================ */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200/50">
          <div className="px-6 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>

              {/* ✅ Dropdown de usuario con sus datos reales */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {userInitial}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{userName}</p>
                    <p className="text-xs text-gray-500 leading-tight">{userEmail}</p>
                  </div>
                  <ChevronDown size={18} className="text-gray-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-500">{userEmail}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                        👤 Usuario
                      </span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">🚪 Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================
        CHAT
        ============================================================ */}
        <main className="p-6 h-[calc(100vh-100px)]">
          <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">LEGAL-iCoop</h3>
                  <p className="text-xs text-blue-200">Asesor Legal Inteligente</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  mensajesRestantes <= 3
                    ? 'bg-red-400/20 text-red-200'
                    : 'bg-white/20 text-blue-200'
                }`}>
                  📊 {mensajesRestantes}/{limiteMensajes}
                </span>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                  🟢 Conectado
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {loadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="flex gap-1 justify-center mb-3">
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce delay-100" />
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce delay-200" />
                    </div>
                    <p className="text-sm text-gray-400">Cargando historial...</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                )))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-md border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                    </div>
                    <span className="text-sm text-gray-500">Escribiendo...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 py-2 bg-gray-50 border-t flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(suggestion)}
                    className="flex-shrink-0 text-xs bg-white border border-gray-200 rounded-full px-4 py-1.5 hover:bg-blue-50 hover:border-blue-300 transition shadow-sm"
                  >
                    {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t p-4 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu consulta legal..."
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                ⚖️ LEGAL-iCoop complementa pero NO reemplaza la asesoría legal humana
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================
      MODAL: LÍMITE DE MENSAJES ALCANZADO
      ============================================================ */}
      <AnimatePresence>
        {showModalLimite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Límite de mensajes alcanzado
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Has alcanzado el límite de {limiteMensajes} mensajes en tu plan actual.
                  Para seguir utilizando LEGAL-iCoop, por favor escribe a:
                </p>
                <a
                  href="mailto:atencion@ebssys.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all mb-4"
                >
                  ✉️ atencion@ebssys.com
                </a>
                <p className="text-xs text-gray-400">
                  Nuestro equipo te atenderá a la brevedad para gestionar tu solicitud.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
      MODAL: CONFIRMAR LIMPIEZA DE CHAT
      ============================================================ */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ¿Limpiar chat?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Se eliminarán todos los mensajes de esta conversación.
                  <br />
                  <span className="font-semibold text-amber-600">
                    El contador de mensajes no se restablecerá.
                  </span>
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleClearChat}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all"
                  >
                    🗑️ Limpiar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWindow;