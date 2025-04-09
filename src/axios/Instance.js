import axios from "axios";
import { toast } from "react-toastify";

// Base URL for all API calls
const BASE_URL = "https://ace-braniac-express-production.up.railway.app/v1";

// ✅ Base API instance (No Authorization)
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

// ✅ Authenticated API instance with token handling
export const apiWithAuth = () => {
  const token = localStorage.getItem("authToken");

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // ✅ Interceptor to handle token expiration
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Redirecting to login...");

        localStorage.removeItem("authToken"); // Clear token

        setTimeout(() => {
          window.location.href = "/"; // Redirect after 2 seconds
        }, 2000);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default api;