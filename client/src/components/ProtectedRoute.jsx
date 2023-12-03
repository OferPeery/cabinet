import { Navigate } from "react-router-dom";
import { getCurrentUserInCookie } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  if (!getCurrentUserInCookie()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;