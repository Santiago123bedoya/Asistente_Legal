// src/components/ChatInterface/ChatWindow.jsx
// 💬 Chat para usuarios normales - Con datos del usuario actual

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, MessageSquare, User, Bot, Sparkles, 
  LogOut, Menu, X, ChevronDown, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../../services/appwrite.service';

const ChatWindow = ({ userId, userRole, onLogout, isAdminMode = false, userData = null }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: '👋 ¡Hola! Soy LEGAL-iCoop, tu Asesor Legal Inteligente en Derecho Cooperativo.\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
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
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                🟢 Conectado
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot size={16} className="text-blue-600" />
                        <span className="text-xs font-medium text-gray-600">LEGAL-iCoop</span>
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : msg.sender === 'system'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-white shadow-md border border-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default ChatWindow;