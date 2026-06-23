// frontend/src/components/ChatInterface/QuickSuggestions.jsx
// 💡 Sugerencias rápidas

import React, { useState } from 'react';

const QuickSuggestions = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = useState('general');

  const categories = {
    general: [
      '¿Cuáles son los requisitos para mantener el control democrático?',
      '¿Qué límites existen para la externalización de funciones?',
      '¿Cómo proteger los datos de los asociados?',
      '¿Qué procedimiento seguir para una fusión?'
    ],
    gobierno: [
      '¿Cómo se elige el consejo directivo?',
      '¿Qué es el control democrático?',
      '¿Cómo convocar una asamblea?',
      '¿Cuáles son las funciones de la Asamblea General?'
    ],
    asociados: [
      '¿Cuáles son los derechos de los asociados?',
      '¿Cómo se pierde la calidad de asociado?',
      '¿Qué obligaciones tienen los asociados?',
      '¿Cómo participar en los excedentes?'
    ],
    legal: [
      '¿Qué dice la ley sobre cooperativas?',
      '¿Cómo proteger datos personales?',
      '¿Qué riesgos legales existen?',
      '¿Cómo hacer una reforma estatutaria?'
    ]
  };

  const categoryLabels = {
    general: '📋 General',
    gobierno: '🏛️ Gobierno',
    asociados: '👥 Asociados',
    legal: '⚖️ Legal'
  };

  return (
    <div className="bg-gray-100 border-t px-4 py-2">
      {/* Categories */}
      <div className="flex gap-2 mb-2 overflow-x-auto">
        {Object.keys(categories).map((key) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              activeCategory === key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            {categoryLabels[key]}
          </button>
        ))}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories[activeCategory].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(suggestion)}
            className="flex-shrink-0 text-xs bg-white border rounded-full px-4 py-1.5 hover:bg-blue-50 hover:border-blue-300 transition shadow-sm"
          >
            {suggestion.length > 50 ? suggestion.substring(0, 50) + '...' : suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;