import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function RutasProtegidas({ children }) {
  const isAuthenticated = sessionStorage.getItem("user-info") === "true";
  const userData = JSON.parse(sessionStorage.getItem("user-data") || "{}");
  const rol = userData.rol || "default"; // Obtener rol del usuario, por defecto "default"
  
  const location = useLocation();
  const allRoutes=["/home","/generals","/users","/products","/projects","/variables","/categories","/orders"];
  const restrictedRoutes = ["/users", "/generals"]; // Rutas restringidas para el rol "default"

  // Si la ruta está restringida y el rol es "default", redirigir al inicio
  if (restrictedRoutes.includes(location.pathname) && rol === "default") {
    return <Navigate to="/home" />;
  }

  if(!allRoutes.includes(location.pathname)){
    return <Navigate to="/" />;
  }

  // Si no está autenticado, redirigir al login
  return isAuthenticated ? children : <Navigate to="/" />;
}

// Validación de props
RutasProtegidas.propTypes = {
  children: PropTypes.any.isRequired,
};