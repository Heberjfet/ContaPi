import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import UserDropdown from "./InfoUser";
import { Modal } from "react-bootstrap";
import Settings from "./Ajustes";
import VerUsuario from "./VerUsuario";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({ nombre, toggleSidebar, isSidebarOpen }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({
    nombre: nombre || "Usuario",
    rol: "Contador Certificado",
    email: ""
  });

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/" || location.pathname === "/homepage";

  const fetchUserData = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (usuarioGuardado) {
        const { id } = JSON.parse(usuarioGuardado);
        if (id) {
          const response = await axios.get(`http://localhost:3001/usuarios/${id}`);
          setUserData((prev) => ({ ...prev, ...response.data }));
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario en Navbar:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [nombre]);

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setUserData(prevData => ({ ...prevData, ...event.detail }));
      } else {
        fetchUserData();
      }
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/homepage');
  };

  return (
    <>
      <nav className={`navbar navbar-dark py-3 ${isSidebarOpen ? "navbar-expanded" : ""}`} style={{ backgroundColor: "#160041", transition: "margin-left 0.3s ease" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button className="btn btn-link text-white me-3" onClick={toggleSidebar}>
              <FaBars size={20} />
            </button>
            <div className="d-flex align-items-center" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
              <img src="/logo.png" alt="Logo Contapi" width="50" height="50" className="me-2" />
              <span className="navbar-brand mb-0">ContaPi</span>
            </div>
          </div>
          <button className="text-white border-0 bg-transparent d-flex align-items-center" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: "pointer" }}>
            <span>Bienvenido, {userData.nombre}</span>
          </button>
          <UserDropdown
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            userData={userData}
            onOpenSettings={() => setShowSettings(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            isHomePage={isHomePage}
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
          <button className="btn-close position-absolute" style={{ top: "15px", right: "15px" }} onClick={() => setShowSettings(false)} aria-label="Cerrar" />
        </Modal.Header>
        <Modal.Body className="px-4">
          <Settings 
            onSave={() => {
              setShowSettings(false);
              fetchUserData();
            }}
            userData={userData}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
        size="md"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 pb-0 pt-4 px-4 position-relative">
          <Modal.Title className="w-100 text-center">
            <h4 className="fw-bold">
              <span className="text-info me-2">👤</span>
              Ver Perfil
            </h4>
          </Modal.Title>
          <button className="btn-close position-absolute" style={{ top: "15px", right: "15px" }} onClick={() => setShowProfileModal(false)} aria-label="Cerrar" />
        </Modal.Header>
        <Modal.Body className="px-4">
          <VerUsuario />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Navbar;
