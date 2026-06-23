// src/components/AdminDashboard/FeedbackManager.jsx
// 💬 Gestión de Feedback

import React, { useState, useEffect } from 'react';

const FeedbackManager = ({ users, stats, onUpdate }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFeedback();
  }, []);

  const cargarFeedback = async () => {
    setLoading(true);
    try {
      // TODO: Conectar con Appwrite para obtener feedback
      setFeedback([
        {
          id: '1',
          userName: 'Juan Pérez',
          score: 5,
          comment: 'Excelente herramienta, muy útil para consultas legales',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          userName: 'María Gómez',
          score: 4,
          comment: 'Muy buena, pero a veces tarda en responder',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error cargando feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando feedback...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">💬 Feedback de Usuarios</h2>
      
      {feedback.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No hay feedback registrado
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{item.userName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400">
                      {'⭐'.repeat(item.score)}{'☆'.repeat(5 - item.score)}
                    </span>
                    <span className="text-sm text-gray-500">({item.score}/5)</span>
                  </div>
                  <p className="text-gray-600 mt-2">{item.comment}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackManager;  // ← ESTO ES LO QUE FALTA