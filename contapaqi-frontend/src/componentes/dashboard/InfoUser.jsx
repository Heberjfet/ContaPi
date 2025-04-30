import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/UserDropdown.css";

const InfoUser = ({ isOpen, onClose, userData, onOpenSettings, isHomePage }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
 
  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
 
  const handleLogout = () => {
    // Eliminar datos de usuario del localStorage
    localStorage.removeItem("usuario");
    alert("Has salido de la cuenta");
    onClose();
   
    // Redirigir al login
    navigate("/");
  };
 
  const handleEditProfile = () => {
    onClose(); // Cerrar el dropdown
    if (onOpenSettings) onOpenSettings(); // Abrir configuración de perfil
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="user-dropdown-backdrop">
      <div ref={dropdownRef} className="user-dropdown-container">
        {/* Header con información del usuario (sin avatar) */}
        <div className="user-header">
          <div className="d-flex align-items-center p-3">
            {/* Removido el avatar circular */}
            <div>
              <h5 className="mb-0">{userData.nombre}</h5>
              <p className="mb-0 text-muted small">{userData.rol}</p>
              <small className="text-muted">{userData.email}</small>
            </div>
            <button
              className="ms-auto btn text-danger border-0"
              onClick={handleLogout}
            >
              <i className="bi bi-power"></i>
            </button>
          </div>
        </div>
        {/* Separador con título "Profile" */}
        <div className="border-bottom px-3 py-2">
          <div className="d-flex align-items-center">
            <i className="bi bi-person text-primary me-2"></i>
            <span className="text-primary">Perfil</span>
          </div>
        </div>
        {/* Opciones de perfil */}
        <div className="profile-options">
          {/* Mostrar "Editar Perfil" solo si está en Homepage */}
          {isHomePage && (
            <button className="profile-option-item" onClick={handleEditProfile}>
              <i className="bi bi-pencil me-2"></i>
              Editar Perfil
            </button>
          )}
          <button className="profile-option-item" onClick={onClose}>
            <i className="bi bi-person me-2"></i>
            Ver Perfil
          </button>
          <button className="profile-option-item" onClick={handleLogout}>
            <i className="bi bi-power me-2"></i>
            Cerrar Sesion
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;