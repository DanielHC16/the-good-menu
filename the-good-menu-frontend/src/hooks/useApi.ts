// =============================================================================
// THE GOOD MENU — Axios API Instance with JWT Interceptors
// =============================================================================
// Centralized HTTP client for all backend communication.
// - Request Interceptor:  Attaches `Authorization: Bearer <token>` from localStorage.
// - Response Interceptor: Catches 401 Unauthorized → clears token → redirects to /login.
// =============================================================================

import axios from 'axios';

// ─── Axios Instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Automatically attach the JWT access token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// Globally intercept 401 Unauthorized responses.
// When a 401 is detected, the user's session is considered expired:
//   1. Clear the stored token to prevent stale auth state.
//   2. Redirect to the login page so the user can re-authenticate.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');

      // Only redirect if not already on the login page to prevent redirect loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

// ─── Hook Export ─────────────────────────────────────────────────────────────
// Provides the configured Axios instance via a custom hook for use in
// React components and React Query API functions.
export const useApi = () => api;

// Also export the raw instance for non-component usage (e.g., standalone API files)
export default api;
