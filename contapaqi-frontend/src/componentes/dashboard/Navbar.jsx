import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import UserDropdown from "./InfoUser";
import { Modal } from "react-bootstrap";
import Settings from "./Ajustes";
import UserProfile from "./UserProfile";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({ toggleSidebar, isSidebarOpen }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({
    nombre: "Cargando...",
    email: "",
    rol: "Contador Certificado"
  });
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:3001/usuarios/${userId}`
      );
     
      setUserData({
        ...userData,
        nombre: response.data.nombre,
        email: response.data.email
      });
     
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
      // Opcional: Redirigir a login si hay error
      // navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [location.pathname]);

  const handleLogoClick = () => {
    navigate("/homepage");
  };

  // Función para cerrar modal y actualizar datos
  const handleSettingsSave = () => {
    setShowSettings(false);
    // Actualizar los datos del usuario después de guardar cambios
    fetchUserData();
  };

  return (
    <>
      <nav
        className={`navbar navbar-dark py-3 ${
          isSidebarOpen ? "navbar-expanded" : ""
        }`}
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
           
            <div
              className="d-flex align-items-center"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            >
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
            <span>Bienvenido, {userData.nombre}</span>
          </button>
          <UserDropdown
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            userData={userData}
            onOpenSettings={() => setShowSettings(true)}
            onViewProfile={() => setShowProfile(true)}
            isHomePage={location.pathname === "/homepage"}
          />
        </div>
      </nav>
      
      {/* Modal de Configuración */}
      <Modal
        show={showSettings}
        onHide={() => setShowSettings(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Configuración de Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Settings onSave={handleSettingsSave} />
        </Modal.Body>
      </Modal>
      
      {/* Modal de Ver Perfil */}
      <Modal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Mi Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserProfile onClose={() => setShowProfile(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Navbar;