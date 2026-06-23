// src/components/Auth/Login.jsx
// 🔐 Login con verificación REAL de contraseña en Appwrite Auth

import React, { useState } from 'react';
import { apiService } from '../../services/appwrite.service';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ USAR EL LOGIN REAL DE APPWRITE (verifica email + password)
      const result = await apiService.login(email, password);
      
      if (!result.success) {
        setError('❌ ' + (result.error || 'Credenciales inválidas'));
        setLoading(false);
        return;
      }

      console.log('✅ Usuario autenticado:', result.user);
      onLogin(result.user);
      
    } catch (error) {
      console.error('Error en login:', error);
      setError('❌ Error al iniciar sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚖️</div>
          <h1 className="text-2xl font-bold text-gray-800">LEGAL-iCoop</h1>
          <p className="text-gray-600">Asesor Legal Inteligente en Derecho Cooperativo</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>🔑 Usa el email y contraseña que te suministro el administrador</p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>⚖️ LEGAL-iCoop complementa pero NO reemplaza la asesoría legal humana</p>
        </div>
      </div>
    </div>
  );
};

export default Login;