/**
 * Admin Authentication Module
 * Handles admin login, logout, and session management
 */

const AdminAuth = (function () {
  // Configuration
  const API_BASE = 'http://localhost:5000/api';
  const TOKEN_KEY = 'admin_token';
  const USER_KEY = 'admin_user';

  /**
   * Login admin user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async function login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token and user info
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  /**
   * Logout admin user
   */
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = 'admin-login.html';
  }

  /**
   * Check if admin is authenticated
   * @returns {boolean}
   */
  function isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (!token || !user) {
      return false;
    }

    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      if (Date.now() >= expiry) {
        logout();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get stored token
   * @returns {string|null}
   */
  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get current admin user info
   * @returns {object|null}
   */
  function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Make authenticated API request
   * @param {string} endpoint 
   * @param {object} options 
   * @returns {Promise<Response>}
   */
  async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE}${endpoint}`, mergedOptions);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      logout();
      throw new Error('Session expired');
    }

    return response;
  }

  /**
   * Protect a page - redirect to login if not authenticated
   */
  function protectPage() {
    if (!isAuthenticated()) {
      window.location.href = 'admin-login.html';
      return false;
    }
    return true;
  }

  /**
   * Verify token with server
   * @returns {Promise<boolean>}
   */
  async function verifyToken() {
    try {
      const response = await apiRequest('/admin/verify');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Public API
  return {
    login,
    logout,
    isAuthenticated,
    getToken,
    getUser,
    apiRequest,
    protectPage,
    verifyToken,
    API_BASE,
  };
})();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminAuth;
}
