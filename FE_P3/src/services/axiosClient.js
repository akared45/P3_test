import axios from "axios";
import {
  getAccessToken,
  clearAccessToken,
} from "../utils/authMemory";
import { refreshTokenRequest } from "./refreshToken"; 

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  withCredentials: true,
});

// ==========================
// 1. REQUEST INTERCEPTOR
// ==========================
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// ==========================
// 2. RESPONSE INTERCEPTOR
// ==========================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) && 
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const newTokens = await refreshTokenRequest();
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return axiosClient(originalRequest);
        
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;