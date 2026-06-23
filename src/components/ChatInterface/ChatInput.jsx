// frontend/src/components/ChatInterface/ChatInput.jsx
// ⌨️ Input de chat con sugerencias

import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white border-t p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta legal..."
            rows="1"
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          />
          <div className="absolute bottom-1 right-2 text-xs text-gray-400">
            {message.length > 0 && `${message.length} caracteres`}
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className={`bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition ${
            (!message.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Enviando...
            </span>
          ) : (
            'Enviar'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;