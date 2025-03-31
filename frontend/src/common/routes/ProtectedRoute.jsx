import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import Loader from "../components/Loader.jsx";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }
  if (currentUser === null) {
    return <Navigate to="/auth" replace />;
  }
  if (currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
