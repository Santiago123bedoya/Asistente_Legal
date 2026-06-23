// src/components/AdminDashboard/MetricsDashboard.jsx
// 📊 Dashboard - Diseño moderno

import React from 'react';
import { Users, Shield, MessageSquare, TrendingUp, UserCheck, Clock } from 'lucide-react';

const MetricsDashboard = ({ users, stats, onUpdate }) => {
  const metricCards = [
    { 
      title: 'Total Usuarios', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      title: 'Administradores', 
      value: stats?.totalAdmins || 0, 
      icon: Shield, 
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      title: 'Consultas Realizadas', 
      value: stats?.totalConsultas || 0, 
      icon: MessageSquare, 
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50'
    },
    { 
      title: 'Tasa de Conversión', 
      value: '67%', 
      icon: TrendingUp, 
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  const recentUsers = users?.slice(0, 5) || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Panel de Control</h2>
        <p className="text-sm text-gray-500">Resumen general del sistema</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${card.color.split('-')[1]}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <UserCheck size={20} className="text-blue-600" />
            Últimos usuarios registrados
          </h3>
          <span className="text-xs text-gray-400">{recentUsers.length} usuarios</span>
        </div>
        
        {recentUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No hay usuarios registrados</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentUsers.map(user => (
              <div key={user.$id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.Nombre?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.Nombre}</p>
                    <p className="text-xs text-gray-500">{user.Email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.Rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.Rol === 'admin' ? 'Admin' : 'Usuario'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsDashboard;