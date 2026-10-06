import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Authentication check hone tak wait
  if (loading) {
    return <p>Loading...</p>;
  }

  // Login nahi kiya
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Specific role check
  if (role && user.role !== role) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "client") {
      return <Navigate to="/client/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;