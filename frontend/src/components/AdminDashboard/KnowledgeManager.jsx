// src/components/AdminDashboard/KnowledgeManager.jsx

import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/appwrite.service';

const KnowledgeManager = ({ users, stats, onUpdate }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    country: '',
    document_type: '',
    tags: '',
    author: ''
  });

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    setLoading(true);
    try {
      // TODO: Conectar con Appwrite
      setDocuments([
        {
          $id: '1',
          Titulo: 'Ley General de Cooperativas',
          Categoria: 'Legislación',
          Pais: 'Colombia',
          Tipo_documento: 'Ley',
          Estado: 'active'
        }
      ]);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando documentos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📚 Base de Conocimiento</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Documento'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No hay documentos
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.$id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{doc.Titulo}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {doc.Categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">{doc.Pais}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      ✏️ Editar
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KnowledgeManager;  // ← ESTO ES LO QUE FALTA