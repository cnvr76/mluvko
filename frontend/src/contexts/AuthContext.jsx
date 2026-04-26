import React, { useContext, createContext, useState, useEffect } from "react";
import { apiClient, api, API_BASE, Roles } from "../services/api.js";
import axios from "axios";

const AuthContext = createContext();

const TokenManager = {
  setAccessToken: (access) => {
    localStorage.setItem("access_token", access);
  },
  getAccessToken: () => localStorage.getItem("access_token"),
  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
  },
};

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

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTherapist, setIsTherapist] = useState(false);

  const refreshToken = async () => {
    const response = await axios.post(
      `${API_BASE}/auth/refresh`,
      {},
      {
        withCredentials: true,
        timeout: 10000,
      }
    );

    const newAccessToken = response.data.tokens.access_token;
    TokenManager.setAccessToken(newAccessToken);

    return newAccessToken;
  };

  const logout = async () => {
    console.log("Logging out...");
    TokenManager.clearTokens();
    setIsAuthenticated(false);
    isRefreshing = false;
    failedQueue = [];
    await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
  };

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);

      if (response.data && response.data.tokens) {
        const { access_token } = response.data.tokens;
        const { username, role } = response.data.user;

        TokenManager.setAccessToken(access_token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        setIsAuthenticated(true);
        setIsAdmin(role === Roles.ADMIN);
        setIsTherapist([Roles.ADMIN, Roles.THERAPIST].includes(role));

        return { success: true, username };
      } else {
        return { success: false, error: "Invalid response format" };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login error",
      };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await api.signup(username, email, password);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Registration error",
      };
    }
  };

  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {
      const token = TokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshToken();
            processQueue(null, newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            logout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = TokenManager.getAccessToken();

      if (accessToken) {
        try {
          const response = await apiClient.get("/users/me");
          const role = response.data.role || localStorage.getItem("role");
          setIsAuthenticated(true);
          setIsAdmin(role === Roles.ADMIN);
          setIsTherapist([Roles.ADMIN, Roles.THERAPIST].includes(role));
        } catch (error) {
          if (error.response?.status === 401) {
            try {
              await refreshToken();
              setIsAuthenticated(true);
              const role = localStorage.getItem("role");
              setIsAdmin(role === Roles.ADMIN);
              setIsTherapist([Roles.ADMIN, Roles.THERAPIST].includes(role));
            } catch (refreshError) {
              logout();
            }
          } else {
            setIsAuthenticated(true);
          }
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const value = {
    isAuthenticated,
    isAdmin,
    isTherapist,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
