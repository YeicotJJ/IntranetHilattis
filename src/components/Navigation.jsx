import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { 
  BsTools, BsFillGearFill, BsCartFill, BsFillInfoCircleFill, BsPeopleFill, 
  BsBox2Fill, BsCircleSquare, BsInboxesFill, BsTextIndentRight, BsTextIndentLeft, BsClipboardFill 
} from "react-icons/bs";
import SidebarHeader from './SidebarHeader';

export default function Navigation() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const getMenuItemStyles = (itemId) => ({
    backgroundColor: hoveredItem === itemId ? '#615944' : '#beac8b',
    color: hoveredItem === itemId ? '#beac8b' : '#1c160f',
    display: collapsed === true ? 'none' : 'flex',
    cursor: 'pointer',
  });

  const getSubMenuStyles = (submenuId) => ({
    backgroundColor: hoveredSubmenu === submenuId ? '#8a5834' : '#1c160f',
    color: hoveredSubmenu === submenuId ? '#1c160f' : '#beac8b',
    display: collapsed === true ? 'none' : 'flex',
    padding: '10px',
    cursor: 'pointer',
  });

  // Obtener datos dinámicos del usuario
  var userData,nombre,rol="Default";
  if(JSON.parse(sessionStorage.getItem("user-data"))!=null){
    userData=JSON.parse(sessionStorage.getItem("user-data"));
  }

  if(userData!=null){
    rol=userData.rol;
    nombre=userData.nombre;
  }

  var rolMuestra="Administrador";
  if(rol=="default"){
    rolMuestra="Trabajador";
  }

  return (
    <Sidebar 
      style={{
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'space-between',
        backgroundColor: '#1c160f',
        color: '#e1d7bf',
        borderRightStyle: 'none',
        overflowY: 'auto',
      }}
      collapsed={collapsed}
    >
      <div style={{ display: 'flex', position: 'absolute' }}>
        <a onClick={toggleSidebar} style={{ margin: '10px', padding: '10px', fontSize: '30px', fontWeight: 'bold', transition: 'all 0.3s ease' }}>
          {collapsed ? <BsTextIndentLeft /> : <BsTextIndentRight />}
        </a>
      </div>

      {/* Header con datos del usuario */}
      <SidebarHeader userName={nombre} userRole={rolMuestra} collapsed={collapsed} />

      {/* Menú Principal */}
      <Menu style={{ height: 'fitContent', backgroundColor: '#1c160f', color: '#e1d7bf', overflowY: 'hidden', margin: '0px', padding: '0px' }}>
        <SubMenu 
          label="Configuración General" 
          icon={<BsFillGearFill />}
          style={getSubMenuStyles(1)}
          onMouseEnter={() => setHoveredSubmenu(1)}
          onMouseLeave={() => setHoveredSubmenu(null)}
        >
          {/* Mostrar estos elementos solo si el rol no es "default" */}
          {rol !== "default" && (
            <>
              <MenuItem 
                component={<Link to={'/generals'} />} 
                icon={<BsFillInfoCircleFill />} 
                style={getMenuItemStyles(1)}
                onMouseEnter={() => setHoveredItem(1)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Datos Empresariales
              </MenuItem>
              <MenuItem 
                component={<Link to={'/users'} />} 
                icon={<BsPeopleFill />} 
                style={getMenuItemStyles(2)}
                onMouseEnter={() => setHoveredItem(2)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Usuarios
              </MenuItem>
            </>
          )}
          <MenuItem 
            component={<Link to={'/projects'} />} 
            icon={<BsTools />} 
            style={getMenuItemStyles(3)}
            onMouseEnter={() => setHoveredItem(3)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Blog Proyectos
          </MenuItem>
        </SubMenu>

        <SubMenu 
          label="E-Commerce" 
          icon={<BsCartFill />}
          style={getSubMenuStyles(2)}
          onMouseEnter={() => setHoveredSubmenu(2)}
          onMouseLeave={() => setHoveredSubmenu(null)}
        >
          <MenuItem 
            component={<Link to={'/products'} />} 
            icon={<BsBox2Fill />} 
            style={getMenuItemStyles(4)}
            onMouseEnter={() => setHoveredItem(4)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Productos
          </MenuItem>
          <MenuItem 
            component={<Link to={'/variables'} />} 
            icon={<BsCircleSquare />} 
            style={getMenuItemStyles(5)}
            onMouseEnter={() => setHoveredItem(5)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Variables
          </MenuItem>
          <MenuItem 
            component={<Link to={'/categories'} />} 
            icon={<BsInboxesFill />} 
            style={getMenuItemStyles(6)}
            onMouseEnter={() => setHoveredItem(6)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Categorias
          </MenuItem>
          <MenuItem 
            component={<Link to={'/orders'} />} 
            icon={<BsClipboardFill />} 
            style={getMenuItemStyles(7)}
            onMouseEnter={() => setHoveredItem(7)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Pedidos
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}
