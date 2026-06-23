// backend/api/middleware/auth.middleware.js
// 🔐 Middleware de autenticación y roles

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    // TODO: Verificar token con Appwrite
    // Por ahora, mock
    req.user = {
      id: 'user_id',
      email: 'user@example.com',
      name: 'Usuario',
      role: 'user'
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Rol no autorizado.'
      });
    }

    next();
  };
};

const rateLimitMiddleware = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const timestamps = requests.get(ip);
    const windowStart = now - windowMs;
    const recentRequests = timestamps.filter(t => t > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Demasiadas solicitudes. Por favor, espera.'
      });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  rateLimitMiddleware
};