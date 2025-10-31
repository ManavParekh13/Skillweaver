// frontend/src/utils/api.js

import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: '/api', // The proxy will handle the rest
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  This is an "interceptor". It runs BEFORE every request.
  It gets the token from localStorage and adds it to the
  'Authorization' header.
*/
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