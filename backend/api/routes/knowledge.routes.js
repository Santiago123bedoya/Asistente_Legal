// backend/api/routes/knowledge.routes.js
// 📚 Rutas de base de conocimiento

const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// GET /api/knowledge - Buscar conocimiento
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { q, country, category, limit = 20 } = req.query;

    // TODO: Buscar en conocimiento
    res.json({
      success: true,
      results: [],
      total: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/knowledge - Crear documento (solo admin)
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { title, content, category, country, document_type, tags } = req.body;

    if (!title || !content || !category || !country || !document_type) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos'
      });
    }

    // TODO: Crear documento en Appwrite
    res.json({
      success: true,
      message: 'Documento creado exitosamente',
      document: {
        id: 'new_doc_id',
        title,
        category,
        country
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/knowledge/:id - Actualizar documento (solo admin)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // TODO: Actualizar documento en Appwrite
    res.json({
      success: true,
      message: 'Documento actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/knowledge/:id - Eliminar documento (solo admin)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Eliminar documento de Appwrite
    res.json({
      success: true,
      message: 'Documento eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;