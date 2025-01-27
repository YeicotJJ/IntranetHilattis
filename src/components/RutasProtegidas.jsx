import { Navigate, useLocation } from "react-router-dom"
import PropTypes from "prop-types"

export default function RutasProtegidas({ children }) {
  const isAuthenticated = sessionStorage.getItem("user-info") === "true"
  const userData = JSON.parse(sessionStorage.getItem("user-data") || "{}")
  const rol = userData.rol || "default"

  const location = useLocation()
  const allRoutes = [
    "/home",
    "/generals",
    "/users",
    "/products",
    "/projects",
    "/variables",
    "/categories",
    "/orders",
    "/projects/new",
    "/projects/edit/:id",
  ]
  const restrictedRoutes = ["/users", "/generals"]

  // Función para verificar si la ruta actual coincide con alguna ruta permitida
  const isRouteAllowed = (currentPath, allowedRoutes) => {
    return allowedRoutes.some((route) => {
      // Convertir la ruta permitida a una expresión regular
      const routeRegex = new RegExp("^" + route.replace(/:[^\s/]+/g, "([\\w-]+)") + "$")
      return routeRegex.test(currentPath)
    })
  }

  // Si la ruta está restringida y el rol es "default", redirigir al inicio
  if (restrictedRoutes.includes(location.pathname) && rol === "default") {
    return <Navigate to="/home" />
  }

  // Verificar si la ruta actual está permitida
  if (!isRouteAllowed(location.pathname, allRoutes)) {
    return <Navigate to="/home" />
  }

  // Si no está autenticado, redirigir al login
  return isAuthenticated ? children : <Navigate to="/" />
}

// Validación de props
RutasProtegidas.propTypes = {
  children: PropTypes.any.isRequired,
}

