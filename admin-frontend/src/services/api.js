import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials) => {
    // For now, simple authentication. In production, use proper auth.
    if (credentials.username === 'admin' && credentials.password === 'password') {
      const token = btoa(JSON.stringify({ username: 'admin', role: 'admin' }));
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify({ username: 'admin', role: 'admin' }));
      return { token, user: { username: 'admin', role: 'admin' } };
    }
    throw new Error('Invalid credentials');
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  }
};

export const ordersAPI = {
  getPendingOrders: () => api.get('/orders/pending'),
  generateBill: (orderId) => api.patch(`/orders/${orderId}/generate-bill`),
  updateOrderStatus: (orderId, status) => api.patch(`/orders/${orderId}`, { status }),
};

export const menuAPI = {
  getMenu: () => api.get('/menu'),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (itemId, data) => api.patch(`/menu/${itemId}`, data),
  deleteMenuItem: (itemId) => api.delete(`/menu/${itemId}`),
};

export default api;