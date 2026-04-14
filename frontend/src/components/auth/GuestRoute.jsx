import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Kontrola...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};
