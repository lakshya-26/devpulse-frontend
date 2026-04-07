import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
if (typeof baseURL !== 'string' || baseURL.trim() === '') {
  throw new Error(
    'VITE_API_URL is missing — add it to devpulse-frontend/.env (this error appears in the browser DevTools Console only, not in the terminal).'
  );
}

const api = axios.create({
  baseURL: baseURL.trim().replace(/\/$/, ''),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devpulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('devpulse_token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
