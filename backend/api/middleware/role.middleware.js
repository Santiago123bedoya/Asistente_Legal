// backend/api/middleware/role.middleware.js
// 🔐 Middleware específico para roles

const roleMiddleware = (req, res, next) => {
  // Este middleware verifica que solo admin pueda registrar usuarios
  const adminOnlyPaths = ['/api/admin/users', '/api/knowledge'];
  
  if (adminOnlyPaths.some(path => req.path.startsWith(path))) {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo administradores pueden realizar esta acción.'
      });
    }
  }

  next();
};

// Middleware para registrar usuarios (solo admin)
const registerUserMiddleware = (req, res, next) => {
  const userRole = req.headers['x-user-role'] || req.user?.role;
  
  if (req.method === 'POST' && req.path === '/api/admin/users') {
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Solo administradores pueden registrar nuevos usuarios.'
      });
    }
  }

  next();
};

module.exports = {
  roleMiddleware,
  registerUserMiddleware
};