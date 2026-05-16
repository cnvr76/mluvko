import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Kontrola...</div>;
  }

  if (isAuthenticated) {
    const from =
      location.state?.from?.pathname || location.state?.from || "/profile";
    return <Navigate to={from} replace />;
  }

  return children;
};
