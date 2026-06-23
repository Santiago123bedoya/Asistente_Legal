// src/App.jsx
// ✅ VERSIÓN DEFINITIVA - SIEMPRE PIDE LOGIN AL RECARGAR

import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import ChatWindow from './components/ChatInterface/ChatWindow';
import DashboardLayout from './components/AdminDashboard/DashboardLayout';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Recargando página - Limpiando sesión...');
    
    // ✅ FORZAR LOGOUT EN CADA RECARGA
    localStorage.removeItem('legal_icoop_user');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    
    console.log('✅ Sesión limpiada. Mostrando Login.');
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
    />
  );
}

export default App;