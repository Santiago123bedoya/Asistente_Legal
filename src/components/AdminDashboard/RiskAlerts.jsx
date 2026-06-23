// src/components/AdminDashboard/RiskAlerts.jsx

import React, { useState, useEffect } from 'react';

const RiskAlerts = ({ users, stats, onUpdate }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    setLoading(true);
    try {
      // TODO: Conectar con Appwrite
      setAlerts([
        {
          id: '1',
          title: '⚠️ Riesgo CRITICAL detectado',
          message: 'Consulta sobre posible violación de derechos de asociados',
          level: 'CRITICAL',
          read: false,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeida = async (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    ));
  };

  const getLevelColor = (level) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-700 border-red-300',
      HIGH: 'bg-orange-100 text-orange-700 border-orange-300',
      MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      LOW: 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[level] || 'bg-gray-100 text-gray-500';
  };

  if (loading) {
    return <div className="text-center py-8">Cargando alertas...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🔔 Alertas de Riesgo</h2>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
          {alerts.filter(a => !a.read).length} sin leer
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No hay alertas pendientes
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${getLevelColor(alert.level)} ${alert.read ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(alert.level)}`}>
                      {alert.level}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{alert.message}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                {!alert.read && (
                  <button
                    onClick={() => marcarComoLeida(alert.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm ml-4 whitespace-nowrap"
                  >
                    Marcar como leída
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskAlerts;  // ← ESTO ES LO QUE FALTA