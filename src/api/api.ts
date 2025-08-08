import axios from 'axios';
import { isTokenValid } from '@/lib/jwt';

// Create an Axios instance
const API = axios.create({
  baseURL: 'https://localhost:7089/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and other configurations
  timeout: 10000,
});

// ✅ Interceptor to attach token if present and valid
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && isTokenValid(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token && !isTokenValid(token)) {
    // Remove invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  // Log request for debugging
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.message);
    
    // Handle network errors (server not running)
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      console.error('Backend server is not running. Please start your backend server on https://localhost:7089');
      // You can show a user-friendly message here
    }
    
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
