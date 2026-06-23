// src/components/AdminDashboard/UserManagement.jsx
// 👥 Gestión de Usuarios - Diseño moderno

import React, { useState } from 'react';
import { Plus, Trash2, UserPlus, Shield, User, Mail, Key, Save } from 'lucide-react';
import { apiService } from '../../services/appwrite.service';

const UserManagement = ({ users: initialUsers, stats, onUpdate }) => {
  const [users, setUsers] = useState(initialUsers || []);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');
  const [editandoLimite, setEditandoLimite] = useState(null);
  const [limiteEditando, setLimiteEditando] = useState(10);
  const [guardandoLimite, setGuardandoLimite] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (!formData.password || formData.password.length < 6) {
      setMessage('❌ La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      const result = await apiService.registrarUsuario({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (result.success) {
        setMessage('✅ Usuario registrado exitosamente');
        setShowRegister(false);
        setFormData({ name: '', email: '', password: '', role: 'user' });
        if (onUpdate) onUpdate();
      } else {
        setMessage('❌ Error: ' + (result.error || 'No se pudo registrar'));
      }
    } catch (error) {
      setMessage('❌ Error al registrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const result = await apiService.eliminarUsuario(userId);
      if (result.success) {
        setMessage('✅ Usuario eliminado');
        if (onUpdate) onUpdate();
      } else {
        setMessage('❌ Error al eliminar');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  const handleSaveLimite = async (userId) => {
    setGuardandoLimite(true);
    try {
      const result = await apiService.actualizarLimiteMensajes(userId, limiteEditando);
      if (result.success) {
        setMessage(`✅ Límite actualizado a ${result.limite} mensajes`);
        setEditandoLimite(null);
        if (onUpdate) onUpdate();
      } else {
        setMessage('❌ Error al actualizar límite');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setGuardandoLimite(false);
    }
  };

  const iniciarEdicion = (user) => {
    setEditandoLimite(user.$id);
    setLimiteEditando(user.limite_mensajes ?? 10);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Gestión de Usuarios</h2>
          <p className="text-sm text-gray-500">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowRegister(!showRegister)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <UserPlus size={18} />
          {showRegister ? 'Cancelar' : 'Registrar Usuario'}
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-xl ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {showRegister && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={20} />
            Registrar Nuevo Usuario
          </h3>
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
              <input
                type="password"
                required
                minLength="6"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">👤 Usuario</option>
                <option value="admin">👑 Administrador</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
                disabled={loading}
              >
                {loading ? 'Registrando...' : '✅ Registrar Usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Límite</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    📭 No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.$id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.Nombre?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium text-gray-800">{user.Nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.Email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.Rol === 'admin' 
                          ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.Rol === 'admin' ? '👑 Admin' : '👤 Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editandoLimite === user.$id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            value={limiteEditando}
                            onChange={(e) => setLimiteEditando(parseInt(e.target.value) || 1)}
                            className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveLimite(user.$id)}
                            disabled={guardandoLimite}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Save size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => iniciarEdicion(user)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                        >
                          <span className="text-gray-700 font-medium">{user.limite_mensajes ?? 10}</span>
                          <span className="text-gray-400 text-xs">✎</span>
                        </button>
                      )}
                      <div className="text-xs text-gray-400 mt-0.5">
                        {user.mensajes_enviados || 0} usados
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ✅ Activo
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteUser(user.$id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;