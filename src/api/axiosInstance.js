// api/axiosInstance.js
import axios from "axios";
import store from "../store";
import { fetchMe } from "../store/authSlice";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allows HttpOnly cookie usage
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const newAccessToken = refreshRes.data.access_token;

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        store.dispatch(fetchMe(newAccessToken)); // refresh Redux user

        return api(originalRequest);
      } catch (err) {
        store.dispatch({ type: "auth/logout" });
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
