import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://69dcd32684f912a264043f10.mockapi.io/api/product',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de request: loguea cada petición saliente
apiClient.interceptors.request.use(
  (config) => {
    console.log(`➡️  [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: loguea el status de cada respuesta
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status ?? 'Sin respuesta';
    const url = error.config?.url ?? '';
    console.error(`❌ [${status}] Error en ${url}:`, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
