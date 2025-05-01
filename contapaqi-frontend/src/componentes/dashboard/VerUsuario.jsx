import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import "../styles/UserProfile.css";

const ViewUser = () => {
  const [userData, setUserData] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "Contador Certificado"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const usuario = localStorage.getItem("usuario");
      if (!usuario) {
        setError("No se encontró sesión de usuario");
        setLoading(false);
        return;
      }

      try {
        const { id } = JSON.parse(usuario);
        const response = await axios.get(`http://localhost:3001/usuarios/${id}`);
        setUserData({
          id: response.data.id,
          nombre: response.data.nombre,
          email: response.data.email,
          rol: response.data.rol || "Contador Certificado"
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
    <div className="profile-container">
      <div className="card shadow">
        <div className="card-body text-center">
          <div className="mb-3">
            <i className="bi bi-person-circle fs-1 text-secondary"></i>
          </div>
          <h5>{userData.nombre}</h5>
          <p className="text-muted mb-1">{userData.rol}</p>
          <p className="text-muted">{userData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
