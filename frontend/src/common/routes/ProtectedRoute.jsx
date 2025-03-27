import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/auth" replace />;
  if (!allowedRoles.includes(currentUser.role))
    return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
