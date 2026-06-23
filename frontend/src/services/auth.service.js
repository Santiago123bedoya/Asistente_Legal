// frontend/src/services/auth.service.js
// 🔐 Servicio de autenticación

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = null;
  }

  async login(email, password) {
    try {
      // TODO: Implementar con Appwrite
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      this.currentUser = data.user;
      this.token = data.token;
      
      localStorage.setItem('legal_icoop_user', JSON.stringify(data.user));
      localStorage.setItem('legal_icoop_token', data.token);

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      this.currentUser = null;
      this.token = null;
      localStorage.removeItem('legal_icoop_user');
      localStorage.removeItem('legal_icoop_token');
    }
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const saved = localStorage.getItem('legal_icoop_user');
      if (saved) {
        this.currentUser = JSON.parse(saved);
      }
    }
    return this.currentUser;
  }

  isAdmin() {
    return this.currentUser?.role === 'admin';
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('legal_icoop_token');
    }
    return this.token;
  }
}

export const authService = new AuthService();