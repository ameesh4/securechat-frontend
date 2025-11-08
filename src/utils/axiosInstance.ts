import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Check if the response contains a new access token in the Authorization header
    const newToken = response.headers.authorization;
    if (newToken) {
      const token = newToken;
      sessionStorage.setItem("token", token);
      setAccessToken(token);
    }
    return response;
  },
  async (error) => {
    // If 401 error, it means either:
    // 1. No token was provided
    // 2. Token expired more than 3 days ago
    // 3. Refresh token is also expired
    // In all cases, redirect to login
    if (error.response?.status === 401) {
      console.error(
        "Authentication failed:",
        error.response?.data?.message || "Unauthorized"
      );

      // Clear stored tokens for current tab only
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
      sessionStorage.removeItem("currentWorkspaceId");
      setAccessToken(null);

      // Redirect to login page
      if (
        typeof window !== undefined &&
        !window.location.pathname.includes("/auth") &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);
export interface IResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
}

export default axiosInstance;
