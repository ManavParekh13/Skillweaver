// frontend/src/utils/api.js

import axios from 'axios';

// 1. Get the production API URL from the .env file
// VITE_ requires that prefix for environment variables
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL, // Use the new URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor (to add the token) is still perfect
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;