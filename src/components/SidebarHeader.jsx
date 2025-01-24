import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";


export default function SidebarHeader({ userName="Default", userRole="Default", collapsed }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Limpiar autenticación
      sessionStorage.clear();
    // Redirigir al login
      navigate("/"); 
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#615944',
        color: '#fff',
        padding: '10px',
        fontSize: '18px',
        fontWeight: 'bold',
      }}
    >

      {/* Logo de la empresa */}
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundImage: 'url("/logo.png")', // Ruta desde la carpeta public
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor:'pointer',
          display: collapsed === true ? 'none' : 'flex',
        }} 
        onClick={() => window.location.href = '/home'}
      />

      {/* Nombre del usuario */}
      <div
        style={{
          marginTop: '10px', // Margen para separar del nombre de la empresa
          fontSize: '16px',
          color: '#fff',
          fontWeight: 'normal',
          display: collapsed === true ? 'none' : 'flex',
        }}
      >
        {userName}
      </div>

      {/* Rol del usuario */}
      <div
        style={{
          marginTop: '5px', // Margen para separar del nombre del usuario
          fontSize: '14px',
          color: '#f0f0f0',
          fontWeight: 'lighter',
          display: collapsed === true ? 'none' : 'flex',
        }}
      >
        {userRole}
      </div>
      <button
        onClick={handleLogout}
        style={{
          color: "#1c160f",
          backgroundColor: "#e1d7bf",
          borderRadius: "1em",
          marginTop:"2.5vh",
          marginBottom:"1vh",
          padding: "1vh 3vw",
          textDecoration: "none",
          cursor:'pointer',
          display: collapsed === true ? 'none' : 'flex',
        }}
      >
        Cerrar Sesión
      </button>
    </div>

  );
}


// Validación de props
SidebarHeader.propTypes = {
  userName: PropTypes.string.isRequired, // Especificas el tipo y si es obligatorio
  userRole: PropTypes.string.isRequired, // Especificas el tipo y si es obligatorio
  collapsed: PropTypes.bool.isRequired, // Especificas el tipo y si es obligatorio
};