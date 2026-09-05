import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { apiClient, api, Roles } from "../services/api.js";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./auth/tokenManager.js";
import { createAuthInterceptors } from "./auth/authInterceptors.js";

const AuthContext = createContext();

const attemptSilentLogin = async (refreshSession) => {
  try {
    const { user } = await refreshSession();
    return user;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTherapist, setIsTherapist] = useState(false);

  const interceptorsRef = useRef(null);

  const applyRole = (role) => {
    setIsAuthenticated(true);
    setIsAdmin(role === Roles.ADMIN);
    setIsTherapist([Roles.ADMIN, Roles.THERAPIST].includes(role));
  };

  // Exchanges the httpOnly refresh cookie for a new access token
  const refreshSession = async () => {
    const { tokens, user } = await api.auth.refresh();
    setAccessToken(tokens.access_token);
    return { accessToken: tokens.access_token, user };
  };

  const logout = async () => {
    clearAccessToken();
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    await api.auth.logout();
  };

  const login = async (email, password) => {
    try {
      const { tokens, user } = await api.auth.login(email, password);

      setAccessToken(tokens.access_token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);
      applyRole(user.role);

      return { success: true, username: user.username };
    } catch (error) {
      const message =
        error.response?.status === 401
          ? "Nesprávny email alebo heslo."
          : "Prihlásenie zlyhalo. Skúste to znova.";
      return { success: false, error: message };
    }
  };

  const signup = async (username, email, password) => {
    try {
      await api.auth.signup(username, email, password);
      return { success: true };
    } catch (error) {
      const detail = error.response?.data?.detail;
      let message = "Registrácia zlyhala. Skontrolujte zadané údaje.";
      if (error.response?.status === 409) {
        message = "Používateľ s týmto emailom už existuje.";
      } else if (typeof detail === "string") {
        message = detail;
      }
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    interceptorsRef.current = createAuthInterceptors({
      apiClient,
      getAccessToken,
      refreshAccessToken: async () => (await refreshSession()).accessToken,
      onAuthFailure: () => logout(),
    });

    return () => interceptorsRef.current?.eject();
  }, [refreshSession, logout]);

  useEffect(() => {
    const initAuth = async () => {
      // no valid refresh cookie -> attemptSilentLogin returns null -> just not authenticated
      const user = await attemptSilentLogin(refreshSession);
      if (user) applyRole(user.role);
      setIsLoading(false);
    };

    initAuth();
  }, [refreshSession, applyRole]);

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
