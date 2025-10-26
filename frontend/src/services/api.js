import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Document endpoints
export const documentAPI = {
  upload: (formData) => {
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  list: () => api.get('/documents/list'),
  check: () => api.get('/documents/check'),
  delete: (id) => api.delete(`/documents/${id}`),
};

// Chat endpoints
export const chatAPI = {
  start: () => api.post('/chat/start'),
  query: (data) => api.post('/chat/query', data),
  history: () => api.get('/chat/history'),
  end: () => api.post('/chat/end'),
};

export default api;
