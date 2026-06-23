// backend/api/routes/admin.routes.js
// 👑 Rutas de administración

const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación y rol admin
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// GET /api/admin/users - Listar usuarios
router.get('/users', async (req, res) => {
  try {
    // TODO: Obtener usuarios de Appwrite
    res.json({
      success: true,
      users: [],
      total: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/admin/users - Registrar usuario (solo admin)
router.post('/users', async (req, res) => {
  try {
    const { email, password, name, role = 'user', cooperative } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password y name son requeridos'
      });
    }

    // TODO: Registrar usuario en Appwrite
    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: 'new_user_id',
        email,
        name,
        role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/admin/users/:userId/role - Actualizar rol
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        error: 'El rol es requerido'
      });
    }

    // TODO: Actualizar rol en Appwrite
    res.json({
      success: true,
      message: 'Rol actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/admin/users/:userId - Eliminar usuario
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Eliminar usuario de Appwrite
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/admin/metrics - Obtener métricas
router.get('/metrics', async (req, res) => {
  try {
    // TODO: Obtener métricas de Appwrite
    res.json({
      success: true,
      metrics: {
        total_users: 0,
        total_queries: 0,
        avg_confidence: 0,
        risks_detected: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;