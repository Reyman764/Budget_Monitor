import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend says our token is missing/invalid/stale (e.g. the database
// was reset and the signed-in user no longer exists), clear the local
// session and send the user back to log in instead of leaving every
// subsequent request failing with the same confusing error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    if ((status === 401 || status === 403) && !isAuthEndpoint && (localStorage.getItem('token') || sessionStorage.getItem('token'))) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      localStorage.removeItem('householdId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
