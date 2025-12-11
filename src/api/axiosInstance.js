// frontend/src/api/axiosInstance.js
import axios from "axios";
import store from "../redux/store";
import { fetchMe, logout } from "../redux/slices/authSlice";
import { API_URL } from "../config/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allows HttpOnly cookie usage
  timeout: 60000, // 60 second timeout
});

// ✅ Track if we're currently refreshing to prevent race conditions
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ REQUEST interceptor - Add access token from Redux state
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth?.session?.access_token;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE interceptor - Handle 401 with refresh queue
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors, skip if already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // ✅ If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ✅ Call refresh endpoint
      const refreshRes = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      
      const newAccessToken = refreshRes.data.access_token;

      // ✅ Update Redux with new token
      // Dispatch fetchMe to update the full user state
      await store.dispatch(fetchMe());

      // ✅ Process queued requests with new token
      processQueue(null, newAccessToken);

      // ✅ Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);

    } catch (err) {
      // ✅ Refresh failed - clear everything and redirect to login
      processQueue(err, null);
      store.dispatch(logout());
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;