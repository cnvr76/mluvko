import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const useAuthAction = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const withAuth = (actionCallback) => {
    return (...args) => {
      if (!isAuthenticated) {
        navigate("/auth?type=login", {
          state: { from: location.pathname + location.search },
          replace: true,
        });
        return;
      }
      return actionCallback(...args);
    };
  };

  return withAuth;
};
