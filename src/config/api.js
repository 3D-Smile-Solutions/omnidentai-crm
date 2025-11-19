// frontend/src/config/api.js
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

// ✅ Use environment variables with fallbacks
export const API_URL = import.meta.env.VITE_BACKEND_URL || 
  (isProduction 
    ? 'https://omnidentai-crm.onrender.com' 
    : 'http://localhost:5000');

export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || API_URL;

console.log('🔧 API Configuration:', {
  mode: import.meta.env.MODE,
  apiUrl: API_URL,
  websocketUrl: WEBSOCKET_URL
});

export default API_URL;