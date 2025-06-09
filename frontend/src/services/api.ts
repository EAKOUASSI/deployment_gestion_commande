// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adapte selon ton backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
