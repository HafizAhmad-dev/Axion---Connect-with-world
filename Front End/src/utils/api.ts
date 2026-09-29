// utils/api.ts
import axios, { AxiosError } from "axios";
import { store } from "../Store/store"; // Import the actual store
import { logoutUser } from "../Store/Slices/UserSlice";
import { setError } from "../Store/Slices/Errors.slice";
import type { AxiosResponse } from "axios";
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  store.dispatch(
    setError({
      code: 500,
      message: "API URL is not defined in environment variables.",
    }),
  );
  console.log("api url not found");
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cache?: RequestCache;
}

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
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401 globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.log(error);

    if (error.response) {
      console.error("Server responded with an error");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);

      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        store.dispatch(logoutUser());

        if (!window.location.pathname.includes("/auth/")) {
          window.location.href = "/auth/login";
        }
      } else {
        store.dispatch(
          setError({
            code: error.response.status,
            message: "Something went wrong. Please try again.",
          }),
        );
      }
    } else if (error.request) {
      console.error("No response received from server");
      console.error("Message:", error.message);

      store.dispatch(
        setError({
          code: 0,
          message: "Unable to connect to the server. Please try again.",
        }),
      );
    } else {
      console.error("Request setup error");
      console.error("Message:", error.message);

      store.dispatch(
        setError({
          code: 0,
          message: "Something went wrong. Please try again.",
        }),
      );
    }

    return Promise.reject(error);
  },
);

// Wrapper function for easy use
export const apiFetch = async <T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient({
      url: endpoint,
      method: options.method ?? "GET",
      data: options.body,
      headers: options.headers,
    });

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ API Request Failed");
      console.error("Method:", options.method ?? "GET");
      console.error("Endpoint:", endpoint);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
    } else {
      console.error("❌ Unexpected API Error:", error);
    }

    throw error;
  }
};

export default apiClient;
