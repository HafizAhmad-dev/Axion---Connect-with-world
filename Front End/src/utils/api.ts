// utils/api.ts
import axios, { AxiosError } from "axios";
import { store } from "../Store/store"; // Import the actual store
import { logoutUser } from "../Store/Slices/UserSlice";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    
    if (error.response?.status === 401) {
      
      // Clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      store.dispatch(logoutUser());
      
      if (!window.location.pathname.includes("/auth/")) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// Wrapper function for easy use
export const apiFetch = async (endpoint: string, options: any = {}) => {
  const response = await apiClient({
    url: endpoint,
    method: options.method || "GET",
    data: options.body,
    headers: options.headers,
  });
  return response;
};

export default apiClient;