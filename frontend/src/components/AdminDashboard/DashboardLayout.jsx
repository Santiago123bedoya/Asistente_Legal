// src/components/AdminDashboard/DashboardLayout.jsx
// 🖥️ Panel de Administración - SIN ALERTAS NI FEEDBACK

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, MessageSquare, 
  LogOut, Menu, X, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserManagement from './UserManagement';
import MetricsDashboard from './MetricsDashboard';
import KnowledgeManager from './KnowledgeManager';
import ChatWindow from '../ChatInterface/ChatWindow';
import { apiService } from '../../services/appwrite.service';

const DashboardLayout = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalConsultas: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const result = await apiService.listarUsuarios();
      if (result.success) {
        setUsers(result.users);
        setStats({
          totalUsers: result.users.length,
          totalAdmins: result.users.filter(u => u.Rol === 'admin').length,
          totalConsultas: 0
        });
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SOLO 5 PESTAÑAS (sin Alertas ni Feedback)
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'knowledge', label: 'Conocimiento', icon: BookOpen },
    { id: 'chat', label: '💬 Chat Legal', icon: MessageSquare }
  ];

  const userName = user?.name || user?.Nombre || 'Administrador';
  const userEmail = user?.email || 'admin@legalicoop.com';
  const userRole = user?.role || 'admin';
  const isAdmin = userRole === 'admin';
  const userInitial = userName?.charAt(0)?.toUpperCase() || 'A';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Cargando...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <MetricsDashboard users={users} stats={stats} onUpdate={cargarDatos} />;
      case 'users':
        return <UserManagement users={users} stats={stats} onUpdate={cargarDatos} />;
      case 'knowledge':
        return <KnowledgeManager users={users} stats={stats} onUpdate={cargarDatos} />;
      case 'chat':
        return (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[calc(100vh-140px)]">
            <ChatWindow 
              userId={user?.$id || user?.id} 
              userRole={userRole} 
              onLogout={onLogout}
              isAdminMode={true}
            />
          </div>
        );
      default:
        return <MetricsDashboard users={users} stats={stats} onUpdate={cargarDatos} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              ⚖️
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">LEGAL-iCoop</h1>
              <p className="text-xs text-gray-500">Panel Administrativo</p>
            </div>
          </div>
        </div>

        {/* Perfil */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Cerrar Sesión */}
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

      {/* CONTENIDO PRINCIPAL */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
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

              {/* Dropdown usuario */}
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
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                        isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isAdmin ? '👑 Administrador' : '👤 Usuario'}
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

        {/* Contenido */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;