   import axios from 'axios';

   const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api' });

   api.interceptors.request.use(cfg => {              // runs before every request
     const token = localStorage.getItem('token');     // token saved at login
     if (token) cfg.headers.Authorization = `Bearer ${token}`; // attach it, like Thunder Client
     return cfg;
   });

   export default api;