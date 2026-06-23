// backend/api/middleware/rate-limit.middleware.js
// ⚡ Rate limiting

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minuto
    this.maxRequests = options.maxRequests || 100;
    this.requests = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const key = this.getKey(req);
      const now = Date.now();
      
      if (!this.requests.has(key)) {
        this.requests.set(key, []);
      }

      const timestamps = this.requests.get(key);
      const windowStart = now - this.windowMs;
      const recentRequests = timestamps.filter(t => t > windowStart);
      
      if (recentRequests.length >= this.maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Demasiadas solicitudes. Intenta de nuevo en unos momentos.',
          retryAfter: Math.ceil((windowStart + this.windowMs - now) / 1000)
        });
      }

      recentRequests.push(now);
      this.requests.set(key, recentRequests);
      next();
    };
  }

  getKey(req) {
    // Usar IP o userId
    const userId = req.user?.id || req.headers['x-user-id'];
    const ip = req.ip || req.connection.remoteAddress;
    return userId || ip;
  }

  // Limpiar peticiones viejas
  cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.requests) {
      const recent = timestamps.filter(t => t > now - this.windowMs);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }
}

module.exports = RateLimiter;