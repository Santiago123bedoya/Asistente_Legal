// backend/api/routes/chat.routes.js
// 💬 Rutas de chat

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

// POST /api/chat/send - Enviar mensaje
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { question, useRAG = true } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'La pregunta es requerida'
      });
    }

    // Llamar a la función de Appwrite
    // const result = await callAppwriteFunction('chat-ai', { question, userId, useRAG });

    // Respuesta mock
    res.json({
      success: true,
      response: {
        text: 'Respuesta generada con DeepSeek...',
        confidence: 0.85,
        category: 'GENERAL',
        sources: [],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/chat/history - Obtener historial
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    // TODO: Obtener historial de Appwrite
    res.json({
      success: true,
      history: [],
      total: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;