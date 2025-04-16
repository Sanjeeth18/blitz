import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  //States
  const isAuthenticated = localStorage.getItem("login") === "true";
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
