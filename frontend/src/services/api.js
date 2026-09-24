import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
      !error.config.url.includes('/auth/login') &&
      !error.config.url.includes('/auth/register')
    ) {
      localStorage.removeItem('ims_token');
      localStorage.removeItem('ims_user');
      // Optional: notify listeners or redirect if necessary
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
