// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
    baseURL: "https://fricalearn-backend-production.up.railway.app/api",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor to attach the token
// axios.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const activeStudentId = localStorage.getItem('active_student_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🚀 Tell Laravel: "Even though I'm a parent, I'm acting for this student"
  if (activeStudentId) {
    config.headers['X-Active-Student-Id'] = activeStudentId;
  }

  return config;
});

export default api;