import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, hasToken } = useUser();

  // Don't redirect to login if still loading and a token exists
  if (isLoading && hasToken) {
    return null; // Show a loading state
  }

  // Only redirect to login if not authenticated AND not loading
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
