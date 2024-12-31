import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { BsTools,BsFillGearFill,BsCartFill,BsFillInfoCircleFill,BsPeopleFill,BsBox2Fill,BsCircleSquare,BsInboxesFill,BsTextIndentRight,BsTextIndentLeft,BsClipboardFill  } from "react-icons/bs";
import SidebarHeader from './SidebarHeader';

export default function Navigation() {
  
  // Determinar el despliegue del Sidebar
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  // Determinar estilos dinámicos de los MenuItem
  const [hoveredItem, setHoveredItem] = useState(null);
  const getMenuItemStyles = (itemId) => ({
    backgroundColor: hoveredItem === itemId ? '#615944' : '#beac8b',
    color: hoveredItem === itemId ? '#beac8b' : '#1c160f',
    display: collapsed === true ? 'none' : 'flex',
    cursor: 'pointer',
  });

  // Determinar estilos dinámicos de los SubMenu
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);
  const getSubMenuStyles = (submenuId) => ({
    backgroundColor: hoveredSubmenu === submenuId ? '#8a5834' : '#1c160f',
    color: hoveredSubmenu === submenuId ? '#1c160f' : '#beac8b',
    display: collapsed === true ? 'none' : 'flex',
    padding: '10px',
    cursor: 'pointer',
  });

  //Determinar datos Dinámicos del Menú
  const nombre=JSON.parse(sessionStorage.getItem("user-data")).nombre;

  return (
    <Sidebar 
    style={{ 
      display:'flex', 
      flexDirection:'column', 
      justifyContent: 'space-between', 
      height:'100vh', 
      backgroundColor: '#1c160f', 
      color: '#e1d7bf', 
      borderRightStyle:'none', 
      marginRight:'20px', 
      overflowY:'hidden'
      }}
      
      collapsed={collapsed}
      >
    
    <div style={{ display: 'flex', position:'absolute' }}>
      {/* Botón para colapsar/desplegar el sidebar */}
      <a onClick={toggleSidebar} style={{ margin: '10px', padding: '10px',fontSize:'30px', fontWeight:'bold', transition: 'all 0.3s ease', }}>
        {collapsed ? <BsTextIndentLeft/> : <BsTextIndentRight/>}
      </a>
      </div>

    {/* Componente de Header con datos del usuario */}
    <SidebarHeader userName={nombre} userRole="Administrador" collapsed={collapsed}/>

      {/* Componente de Menú Principal*/}
      <Menu style={{height: 'fitContent', backgroundColor: '#1c160f', color: '#e1d7bf', overflowY:'hidden', margin:'0px', padding:'0px'}}>
      <SubMenu label="Configuración General" icon={<BsFillGearFill />}
      style={getSubMenuStyles(1)}
      onMouseEnter={() => setHoveredSubmenu(1)}
      onMouseLeave={() => setHoveredSubmenu(null)}
      >

          <MenuItem component={<Link to={'/generals'} />} icon={<BsFillInfoCircleFill/>} 
          style={getMenuItemStyles(1)}
          onMouseEnter={() => setHoveredItem(1)}
          onMouseLeave={() => setHoveredItem(null)}
          >Datos Empresariales</MenuItem>

          <MenuItem component={<Link to={'/users'} />} icon={<BsPeopleFill/>} 
          style={getMenuItemStyles(2)}
          onMouseEnter={() => setHoveredItem(2)}
          onMouseLeave={() => setHoveredItem(null)}
          >Usuarios</MenuItem>

          <MenuItem component={<Link to={'/projects'} />} icon={<BsTools />} 
          style={getMenuItemStyles(3)}
          onMouseEnter={() => setHoveredItem(3)}
          onMouseLeave={() => setHoveredItem(null)}
          >Blog Proyectos</MenuItem>
        </SubMenu>

        <SubMenu label="E-Commerce" icon={<BsCartFill />}
        style={getSubMenuStyles(2)}
        onMouseEnter={() => setHoveredSubmenu(2)}
        onMouseLeave={() => setHoveredSubmenu(null)}
        >
          <MenuItem component={<Link to={'/products'} />} icon={<BsBox2Fill/>} 
          style={getMenuItemStyles(4)}
          onMouseEnter={() => setHoveredItem(4)}
          onMouseLeave={() => setHoveredItem(null)}
          >Productos</MenuItem>
          
          <MenuItem component={<Link to={'/variables'} />} icon={<BsCircleSquare/>} 
          style={getMenuItemStyles(5)}
          onMouseEnter={() => setHoveredItem(5)}
          onMouseLeave={() => setHoveredItem(null)}
          >Variables</MenuItem>

          <MenuItem component={<Link to={'/categories'} />} icon={<BsInboxesFill/>} 
          style={getMenuItemStyles(6)}
          onMouseEnter={() => setHoveredItem(6)}
          onMouseLeave={() => setHoveredItem(null)}
          >Categorias</MenuItem>
          
          <MenuItem component={<Link to={'/orders'} />} icon={<BsClipboardFill/>} 
          style={getMenuItemStyles(7)}
          onMouseEnter={() => setHoveredItem(7)}
          onMouseLeave={() => setHoveredItem(null)}
          >Pedidos</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  )
}
