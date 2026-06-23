// src/components/ChatInterface/MessageBubble.jsx
// 💬 Burbuja de mensaje con Markdown renderizado y fuentes

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownContent = ({ text }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1">{children}</ol>,
      li: ({ children }) => <li className="text-sm">{children}</li>,
      p: ({ children }) => <p className="text-sm mb-1 last:mb-0">{children}</p>,
      code: ({ children, ...props }) => {
        const { className } = props;
        const isInline = !className;
        return isInline
          ? <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
          : <code className="block bg-gray-900 text-green-300 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2">{children}</code>;
      },
      h1: ({ children }) => <h1 className="text-lg font-bold mt-2 mb-1">{children}</h1>,
      h2: ({ children }) => <h2 className="text-base font-bold mt-2 mb-1">{children}</h2>,
      h3: ({ children }) => <h3 className="text-sm font-bold mt-1 mb-1">{children}</h3>,
      a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {children}
        </a>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-blue-300 pl-3 my-2 text-gray-600 italic">
          {children}
        </blockquote>
      ),
    }}
  >
    {text}
  </ReactMarkdown>
);

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

  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
            : 'bg-white shadow-md border border-gray-100 text-gray-800'
        }`}
      >
        {/* Contenido con Markdown (solo para bot) o texto plano (user) */}
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <MarkdownContent text={message.text} />
          </div>
        )}

        {/* Timestamp para mensajes del usuario */}
        {isUser && (
          <div className="flex items-center gap-2 justify-end mt-1">
            <span className="text-xs text-blue-200">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Fuentes (solo bot) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 text-sm border-t border-gray-100 pt-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs transition-colors"
            >
              📚 {showSources ? 'Ocultar' : 'Ver'} fuentes ({message.sources.length})
            </button>
            {showSources && (
              <div className="mt-2 space-y-2">
                {message.sources.map((source, idx) => (
                  <div key={idx} className="text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="font-medium text-gray-700">{source.title}</div>
                    {source.category && (
                      <div className="text-gray-400 text-xs mt-0.5">{source.category}</div>
                    )}
                    {source.snippet && (
                      <p className="text-gray-500 mt-1 leading-relaxed">{source.snippet}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Confianza y revisión humana */}
        {!isUser && message.confidence !== undefined && (
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="text-gray-400">
              Confianza: {Math.round(message.confidence * 100)}%
            </span>
            {message.needsHuman && (
              <span className="text-amber-600 font-medium">⚠️ Requiere revisión humana</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
