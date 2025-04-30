import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import "../styles/UserProfile.css";

const UserProfile = ({ onClose }) => {
  const [userData, setUserData] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "Contador Certificado" // Rol por defecto
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No se encontró sesión de usuario");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:3001/usuarios/${userId}`);
        
        setUserData({
          ...userData,
          id: response.data.id,
          nombre: response.data.nombre,
          email: response.data.email
        });
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
        setError("No se pudieron cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
      <div className="profile-card card">
        <div className="card-body text-center">
          <div className="profile-avatar">
            <i className="bi bi-person"></i>
          </div>
          <h4 className="profile-name">{userData.nombre}</h4>
          <p className="profile-role">{userData.rol}</p>
          
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="profile-info-section">
                <h6 className="profile-info-label">ID de Usuario</h6>
                <p className="profile-info-value">{userData.id}</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="profile-info-section">
                <h6 className="profile-info-label">Nombre Completo</h6>
                <p className="profile-info-value">{userData.nombre}</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="profile-info-section">
                <h6 className="profile-info-label">Correo Electrónico</h6>
                <p className="profile-info-value">{userData.email}</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="profile-info-section">
                <h6 className="profile-info-label">Rol</h6>
                <p className="profile-info-value">{userData.rol}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              Último acceso: {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="profile-footer text-center">
          <button 
            className="btn btn-primary profile-close-btn"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
  );
};

export default UserProfile;