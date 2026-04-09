// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
    // 🌍 Points to your Railway Production Backend
    baseURL: "https://fricalearn-backend-production.up.railway.app/api",
    headers: {
        'Accept': 'application/json',
        // Removed global 'Content-Type' to allow Axios/Browser to handle it dynamically 
        // especially for File Uploads (multipart/form-data)
    },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const activeStudentId = localStorage.getItem('active_student_id');

  // 🔑 Attach the Sanctum/JWT Token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🚀 Parent-Student Impersonation Header
  // Tells Laravel: "Even though I'm a parent, I'm acting for this student"
  if (activeStudentId) {
    config.headers['X-Active-Student-Id'] = activeStudentId;
  }

  return config;
});

export default api;