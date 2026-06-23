// frontend/src/components/ChatInterface/MessageBubble.jsx
// 💬 Burbuja de mensaje con fuentes

import React, { useState } from 'react';

const MessageBubble = ({ message }) => {
  const [showSources, setShowSources] = useState(false);

  if (message.sender === 'system') {
    return (
      <div className={`flex justify-center ${message.type === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
        <div className="bg-white border rounded-lg px-4 py-2 text-sm shadow-sm max-w-2xl">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-lg p-4 ${
          message.sender === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800 shadow-md'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.text}</div>
        
        {/* Fuentes */}
        {message.sender === 'bot' && message.sources && message.sources.length > 0 && (
          <div className="mt-3 text-sm border-t pt-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-xs"
            >
              📚 {showSources ? 'Ocultar' : 'Ver'} fuentes ({message.sources.length})
            </button>
            {showSources && (
              <div className="mt-2 space-y-2">
                {message.sources.map((source, idx) => (
                  <div key={idx} className="text-xs bg-gray-50 p-2 rounded border">
                    <div className="font-medium text-gray-700">{source.title}</div>
                    <div className="text-gray-500 text-xs">{source.category}</div>
                    <p className="text-gray-600 mt-1">{source.snippet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Confianza */}
        {message.sender === 'bot' && message.confidence && (
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="text-gray-400">
              Confianza: {Math.round(message.confidence * 100)}%
            </span>
            {message.needsHuman && (
              <span className="text-yellow-600">⚠️ Requiere revisión humana</span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-1 text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;