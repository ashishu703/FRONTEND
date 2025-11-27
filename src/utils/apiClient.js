import { API_ENDPOINTS } from '../api/admin_api/api';

/**
 * Simple API Client - Direct calls to backend APIs
 * Follows DRY principles by using existing backend endpoints
 */
class ApiClient {
  constructor() {
    // Use empty string for relative URLs to work with Vite proxy
    // The proxy will forward /api requests to the backend
    this.baseURL = '';
    
    // Only use full URL if explicitly provided via env variable (for production)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiBaseUrl && apiBaseUrl.includes('http')) {
      this.baseURL = apiBaseUrl.replace(/\/api.*$/, '');
    }
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Set authentication token in localStorage
   */
  setAuthToken(token) {
    // Only set in this tab. We still use localStorage to keep compatibility,
    // but set ALSO a session-scoped copy and prefer that for reads.
    try { sessionStorage.setItem('authToken', token); } catch {}
    // Clear legacy storage key to avoid stale tokens in older components
    localStorage.removeItem('token');
    localStorage.setItem('authToken', token);
  }

  /**
   * Completely clear authentication artifacts from both storage scopes
   */
  clearStoredAuth() {
    try {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('impersonating');
      sessionStorage.removeItem('user');
    } catch (_) {}

    localStorage.removeItem('authToken');
    localStorage.removeItem('token'); // Legacy key used by older components
    localStorage.removeItem('user');
  }

  /**
   * Remove authentication token from storage (wrapper maintained for backwards compatibility)
   */
  removeAuthToken() {
    this.clearStoredAuth();
  }

  /**
   * Get headers with authentication token if available
   */
  getHeaders() {
    // Prefer session token (per-tab) if available, fallback to localStorage
    const token = sessionStorage.getItem('authToken') || this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle API response and errors
   */
  async handleResponse(response) {
    // Gracefully handle empty bodies and non-JSON
    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');
    let data = null;
    if (response.status === 204 || contentLength === '0') {
      data = {};
    } else if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (_) {
        data = {};
      }
    } else {
      try {
        const text = await response.text();
        data = text ? { message: text } : {};
      } catch (_) {
        data = {};
      }
    }
    
    if (!response.ok) {
      // Extract error message from response - check both 'error' and 'message' fields
      const errorMessage = data.error || data.message || 'An error occurred';

      // If authentication failed (expired / invalid token), proactively clear stored auth
      if (response.status === 401 && errorMessage.toLowerCase().includes('not authorized')) {
        this.clearStoredAuth();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
          if (!window.location.pathname.toLowerCase().includes('login')) {
            window.location.href = '/login';
          }
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      error.message = errorMessage; // Ensure message is set
      throw error;
    }
    
    return data;
  }

  /**
   * Make HTTP request
   */
  async request(url, options = {}) {
    try {
      // Validate URL parameter
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL provided to API request');
      }

      const config = {
        headers: this.getHeaders(),
        ...options,
      };

      // Use relative URLs for proxy, or full URLs if baseURL is set
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      const response = await fetch(fullUrl, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * GET request
   */
  async get(url) {
    return this.request(url, { method: 'GET' });
  }

  /**
   * PUT request
   */
  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(url, data = {}) {
    return this.request(url, {
      method: 'DELETE',
      body: Object.keys(data).length > 0 ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * POST FormData request
   */
  async postFormData(url, formData) {
    try {
      // Validate URL parameter
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL provided to postFormData request');
      }

      const token = sessionStorage.getItem('authToken') || this.getAuthToken();
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Do NOT set Content-Type for FormData; browser sets boundary
        },
        body: formData,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Request Error (postFormData):', error);
      throw error;
    }
  }

  async putFormData(url, formData) {
    try {
      // Validate URL parameter
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL provided to putFormData request');
      }

      const token = sessionStorage.getItem('authToken') || this.getAuthToken();
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Do NOT set Content-Type for FormData; browser sets boundary
        },
        body: formData,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Request Error (putFormData):', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

// Export singleton instance
export default new ApiClient();
