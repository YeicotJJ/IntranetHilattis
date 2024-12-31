import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function RutasProtegidas({ children }) {
  const isAuthenticated = sessionStorage.getItem("user-info") === "true";

  return isAuthenticated ? children : <Navigate to="/" />;
}
// Validación de props
RutasProtegidas.propTypes = {
  children: PropTypes.any.isRequired, // Especificas el tipo y si es obligatorio
};