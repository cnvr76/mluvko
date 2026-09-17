import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Redirects to the login page (preserving where to come back to via
// location state, read by GuestRoute) when the user isn't authenticated.
// Returns true if it redirected, so the caller can bail out of the action.
const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    if (isAuthenticated) return false;
    navigate("/auth?type=login", { state: { from: location }, replace: true });
    return true;
  };
};

export default useRequireAuth;
