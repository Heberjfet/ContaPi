import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import UserDropdown from "./InfoUser"; // Importamos el componente

function Navbar({ nombre, toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Datos de ejemplo del usuario
  const userData = {
    nombre: nombre || "Usuario",
    rol: "Contador Certificado", // Como se muestra en la imagen
    email: "usuario@ejemplo.com",
    avatar: "/path/to/avatar.jpg" // Ajusta según tus recursos
  };

  return (
    <nav
      className="navbar navbar-dark py-3"
      style={{ backgroundColor: "#160041" }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-white me-3"
            onClick={toggleSidebar}
          >
            <FaBars size={20} />
          </button>
          <div className="d-flex align-items-center">
            <img
              src="/logo.png"
              alt="Logo Contapi"
              width="50"
              height="50"
              className="me-2"
            />
            <span className="navbar-brand mb-0">ContaPi</span>
          </div>
        </div>
        
        {/* Botón para mostrar el dropdown */}
        <button 
          className="text-white border-0 bg-transparent d-flex align-items-center" 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ cursor: 'pointer' }}
        >
          <span>Bienvenido, {nombre}</span>
          {/* Opcionalmente puedes agregar un icono aquí */}
        </button>

        {/* UserDropdown Component */}
        <UserDropdown 
          isOpen={showDropdown} 
          onClose={() => setShowDropdown(false)}
          userData={userData}
        />
      </div>
    </nav>
  );
}

export default Navbar;