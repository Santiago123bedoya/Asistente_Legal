// frontend/src/services/chat.service.js
// 💬 Servicio de chat

import { apiService } from './appwrite.service';

class ChatService {
  constructor() {
    this.history = [];
    this.currentSession = null;
  }

  async sendMessage(question, userId, useRAG = true) {
    const startTime = Date.now();

    try {
      const response = await apiService.sendChatMessage({
        question,
        userId,
        useRAG
      });

      const processingTime = Date.now() - startTime;

      if (response.success) {
        this.history.push({
          question,
          response: response.response.text,
          timestamp: new Date().toISOString(),
          processingTime
        });
      }

      return response;
    } catch (error) {
      console.error('Error en sendMessage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getHistory(userId, limit = 50) {
    try {
      const response = await apiService.getChatHistory(userId, limit);
      if (response.success) {
        this.history = response.history || [];
      }
      return response;
    } catch (error) {
      console.error('Error en getHistory:', error);
      return { success: false, error: error.message };
    }
  }

  clearHistory() {
    this.history = [];
  }

  getLastMessages(count = 10) {
    return this.history.slice(-count);
  }
}

export const chatService = new ChatService();