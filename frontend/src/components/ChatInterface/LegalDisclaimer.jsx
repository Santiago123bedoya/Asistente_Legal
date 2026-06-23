// frontend/src/components/ChatInterface/LegalDisclaimer.jsx
// ⚖️ Descargo legal

import React from 'react';

const LegalDisclaimer = () => {
  return (
    <div className="bg-gray-50 border-t py-2 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs text-gray-400">
          ⚖️ <span className="font-semibold">LEGAL-iCoop</span> complementa pero 
          <span className="text-yellow-600 font-semibold"> NO reemplaza</span> la asesoría legal humana.
          Para decisiones importantes, siempre consulta con un abogado especializado.
        </p>
        <div className="mt-1 flex justify-center gap-4 text-xs text-gray-300">
          <span>🔒 Datos protegidos</span>
          <span>📅 Respuestas 24/7</span>
          <span>📚 Basado en legislación vigente</span>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;