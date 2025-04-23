import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import UserDropdown from "./InfoUser";
import { Modal } from "react-bootstrap";
import Settings from "./Ajustes"; 
import { useLocation } from "react-router-dom"; // Importamos useLocation para detectar la ruta actual

function Navbar({ nombre, toggleSidebar, isSidebarOpen }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation(); // Obtenemos la ubicación actual
  
  // Verificamos si estamos en la página Homepage
  const isHomePage = location.pathname === "/" || location.pathname === "/homepage";
  
  // Datos de ejemplo del usuario
  const userData = {
    nombre: nombre || "Usuario",
    rol: "Contador Certificado",
    email: "usuario@ejemplo.com",
    avatar: "/path/to/avatar.jpg",
  };
  
  return (
    <>
      <nav
        className={`navbar navbar-dark py-3 ${
          isSidebarOpen ? "navbar-expanded" : ""
        }`}
        style={{
          backgroundColor: "#160041",
          transition: "margin-left 0.3s ease",
        }}
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
          <button
            className="text-white border-0 bg-transparent d-flex align-items-center"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: "pointer" }}
          >
            <span>Bienvenido, {nombre}</span>
          </button>
          <UserDropdown
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            userData={userData}
            onOpenSettings={() => setShowSettings(true)}
            isHomePage={isHomePage} // Pasamos la información de si estamos en Homepage
          />
        </div>
      </nav>
      <Modal
        show={showSettings}
        onHide={() => setShowSettings(false)}
        centered
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 pb-0 pt-4 px-4 position-relative">
          <Modal.Title className="w-100 text-center">
            <h4 className="fw-bold">
              <span className="text-primary me-2">✏️</span>
              Editar Perfil
            </h4>
          </Modal.Title>
          <button
            className="btn-close position-absolute"
            style={{ top: "15px", right: "15px" }}
            onClick={() => setShowSettings(false)}
            aria-label="Cerrar"
          />
        </Modal.Header>
        <Modal.Body className="px-4">
          <Settings onSave={() => setShowSettings(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
}
export default Navbar;