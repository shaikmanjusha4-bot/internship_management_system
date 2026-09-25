import axios from 'axios';

// Smart Backend URL resolver:
// 1. Explicit environment variable: VITE_API_URL
// 2. When running locally (localhost or 127.0.0.1): use '/api' (Vite dev server proxies to http://localhost:5000)
// 3. In production (e.g. deployed on Vercel): point to live Render backend https://internship-management-system-i4aq.onrender.com/api
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      return '/api';
    }
  }
  return 'https://internship-management-system-i4aq.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout to allow Render free tier cold starts
});

// Request interceptor: automatically add Bearer token to headers if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ims_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standard error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized occurs on protected routes (excluding login/register attempts)
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config?.url?.includes('/auth/login') &&
      !error.config?.url?.includes('/auth/register')
    ) {
      localStorage.removeItem('ims_token');
      localStorage.removeItem('ims_user');
      // If window exists, trigger custom event so components can react
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// User endpoints
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Internship endpoints
export const internshipService = {
  getAll: (params) => api.get('/internships', { params }),
  getRecommended: () => api.get('/internships/recommended'),
  getById: (id) => api.get(`/internships/${id}`),
  create: (data) => api.post('/internships', data),
  update: (id, data) => api.put(`/internships/${id}`, data),
  delete: (id) => api.delete(`/internships/${id}`),
};

// Application endpoints
export const applicationService = {
  apply: (internshipId) => api.post('/applications', { internshipId }),
  getMyApplications: () => api.get('/applications/my'),
  getAllApplications: (params) => api.get('/applications', { params }),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  getStats: () => api.get('/applications/stats'),
};

export default api;
