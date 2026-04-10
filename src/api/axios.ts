// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
    /** * 🌍 Dynamic API URL 
     * Uses the environment variable from .env 
     * Defaults to your new Namecheap API if the variable is missing
     */
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.fricalearn.com/api",
    headers: {
        'Accept': 'application/json',
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