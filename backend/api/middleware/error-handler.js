// backend/api/middleware/error-handler.js
// 🛡️ Manejador de errores global

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Error personalizado
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores comunes predefinidos
const errors = {
  NotFound: (message = 'Recurso no encontrado') => new AppError(message, 404),
  Unauthorized: (message = 'No autorizado') => new AppError(message, 401),
  Forbidden: (message = 'Acceso denegado') => new AppError(message, 403),
  BadRequest: (message = 'Solicitud inválida') => new AppError(message, 400),
  Conflict: (message = 'Conflicto con el estado actual') => new AppError(message, 409),
  Validation: (message = 'Error de validación') => new AppError(message, 422),
  Internal: (message = 'Error interno del servidor') => new AppError(message, 500)
};

module.exports = {
  errorHandler,
  AppError,
  errors
};