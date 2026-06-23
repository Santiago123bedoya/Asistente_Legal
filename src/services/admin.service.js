// frontend/src/services/admin.service.js
// 👑 Servicio de administración

import { apiService } from './appwrite.service';

class AdminService {
  // 👥 Usuarios
  async getUsers() {
    return apiService.listUsers();
  }

  async registerUser(userData) {
    return apiService.registerUser(userData);
  }

  async updateUserRole(userId, newRole) {
    try {
      // TODO: Implementar
      return { success: true };
    } catch (error) {
      console.error('Error en updateUserRole:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteUser(userId) {
    try {
      // TODO: Implementar
      return { success: true };
    } catch (error) {
      console.error('Error en deleteUser:', error);
      return { success: false, error: error.message };
    }
  }

  // 📚 Conocimiento
  async getKnowledgeDocuments() {
    return apiService.listKnowledgeDocuments();
  }

  async createKnowledgeDocument(data) {
    return apiService.createKnowledgeDocument(data);
  }

  async updateKnowledgeDocument(id, data) {
    return apiService.updateKnowledgeDocument(id, data);
  }

  async deleteKnowledgeDocument(id) {
    return apiService.deleteKnowledgeDocument(id);
  }

  // 📊 Métricas
  async getMetrics(type = 'daily') {
    return apiService.getMetrics(type);
  }

  async getDashboardMetrics() {
    try {
      const [daily, users, knowledge] = await Promise.all([
        apiService.getMetrics('daily'),
        apiService.getMetrics('users'),
        apiService.getMetrics('knowledge')
      ]);

      return {
        success: true,
        metrics: {
          daily: daily.metrics || {},
          users: users.users || {},
          knowledge: knowledge.knowledge || {}
        }
      };
    } catch (error) {
      console.error('Error en getDashboardMetrics:', error);
      return { success: false, error: error.message };
    }
  }

  // 🔔 Alertas
  async getAlerts() {
    try {
      // TODO: Implementar
      return { success: true, alerts: [] };
    } catch (error) {
      console.error('Error en getAlerts:', error);
      return { success: false, error: error.message };
    }
  }

  async markAlertRead(alertId) {
    try {
      // TODO: Implementar
      return { success: true };
    } catch (error) {
      console.error('Error en markAlertRead:', error);
      return { success: false, error: error.message };
    }
  }
}

export const adminService = new AdminService();