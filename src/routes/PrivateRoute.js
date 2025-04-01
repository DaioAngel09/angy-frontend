import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ usuario, requiredRole, children }) => {
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // ✅ Administrador tem acesso total
  if (usuario.role === "admin") {
    return children;
  }

  // ✅ Permitir apenas usuários com a role correta
  if (usuario.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
