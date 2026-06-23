// backend/api/routes/auth.routes.js
// 🔐 Rutas de autenticación

const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// POST /api/auth/login - Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y password son requeridos'
      });
    }

    // TODO: Implementar login con Appwrite
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: 'user_id',
        name: 'Usuario',
        email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/logout - Logout
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

// GET /api/auth/me - Obtener perfil
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;