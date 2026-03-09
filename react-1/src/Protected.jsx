import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const rol = usuario?.rol?.toLowerCase();

  // ❌ Si no tiene token → no puede entrar
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Si el rol no está permitido → acceso denegado
  if (roles && !roles.includes(rol)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;
