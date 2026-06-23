// src/App.jsx
// ✅ PERSISTENCIA DE SESIÓN - Restaura desde localStorage al recargar

import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import ChatWindow from './components/ChatInterface/ChatWindow';
import DashboardLayout from './components/AdminDashboard/DashboardLayout';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ RESTAURAR SESIÓN DESDE LOCALSTORAGE
    const savedUser = localStorage.getItem('legal_icoop_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('🔄 Sesión restaurada:', userData.email);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        console.warn('⚠️ Error al restaurar sesión, limpiando:', e);
        localStorage.removeItem('legal_icoop_user');
      }
    } else {
      console.log('👋 No hay sesión guardada. Mostrando Login.');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('🔐 Login exitoso:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('legal_icoop_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    console.log('🚪 Cerrando sesión...');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('legal_icoop_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">⚖️</div>
          <div className="text-xl font-semibold text-gray-600 animate-pulse">
            Cargando LEGAL-iCoop...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // ✅ SI ES ADMIN → DASHBOARD
  if (user?.role === 'admin') {
    console.log('👑 Usuario ADMIN → Dashboard');
    return <DashboardLayout user={user} onLogout={handleLogout} />;
  }

  // ✅ SI ES USUARIO NORMAL → CHAT
  console.log('👤 Usuario NORMAL → Chat');
  return (
    <ChatWindow 
      userId={user?.$id || user?.id} 
      userRole={user?.role || 'user'} 
      onLogout={handleLogout}
      mensajesEnviados={user?.mensajes_enviados || 0}
      limiteMensajes={user?.limite_mensajes ?? 10}
    />
  );
}

export default App;