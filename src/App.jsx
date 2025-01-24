import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Products from './pages/Products/Products.jsx';
import Home  from './pages/Home/Home';
import Login  from './pages/Login/Login.jsx';
import Generals from './pages/Generals/Generals.jsx';
import Users from './pages/Users/Users.jsx';
import Projects from './pages/Projects/Projects.jsx';
import NewProject from './pages/Projects/NewProject.jsx';
import EditProject from './pages/Projects/EditProject.jsx';
import Variables from './pages/Variables/Variables.jsx';
import Categories from './pages/Categories/Categories.jsx';
import Orders from './pages/Orders/Orders.jsx';
import Navigation from './components/Navigation.jsx';
import { useState, useEffect } from "react";
import RutasProtegidas from "./components/RutasProtegidas";

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

// Componente para gestionar la visibilidad de la navegación y las rutas
function MainLayout() {
  const location = useLocation();

  // Determinar si se oculta la navegación en ciertas rutas
  const hideNavigationPaths = ["/"];
  const isNavigationHidden = hideNavigationPaths.includes(location.pathname);

  // Verificar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("user-info") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(sessionStorage.getItem("user-info") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Cambiar la clase en #root cuando se esté en la página de login
  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (location.pathname === "/") {
      rootElement.classList.add("login");
    }
    if (location.pathname === "/generals") {
      rootElement.classList.add("gen");
    } else {
      rootElement.classList.remove("login");
    }
  }, [location]);

  return (
    <div className={isNavigationHidden ? "login" : "normal"}>
      {!isNavigationHidden && <Navigation />}
      <Routes>
  <Route index path="/" element={<Login />} />
  <Route path="*" element={<RutasProtegidas><Login /></RutasProtegidas>} />
  <Route path="/home" element={<RutasProtegidas><Home /></RutasProtegidas>} />
  <Route path="/generals" element={<RutasProtegidas><Generals /></RutasProtegidas>} />
  <Route path="/users" element={<RutasProtegidas><Users /></RutasProtegidas>} />
  <Route path="/projects" element={<RutasProtegidas><Projects /></RutasProtegidas>} />
  <Route path="/projects/new" element={<RutasProtegidas><NewProject /></RutasProtegidas>} />
  <Route path="/projects/edit/:id" element={<RutasProtegidas><EditProject /></RutasProtegidas>} />
  <Route path="/products" element={<RutasProtegidas><Products /></RutasProtegidas>} />
  <Route path="/variables" element={<RutasProtegidas><Variables /></RutasProtegidas>} />
  <Route path="/categories" element={<RutasProtegidas><Categories /></RutasProtegidas>} />
  <Route path="/orders" element={<RutasProtegidas><Orders /></RutasProtegidas>} />
</Routes>

    </div>
  );
}

export default App;
