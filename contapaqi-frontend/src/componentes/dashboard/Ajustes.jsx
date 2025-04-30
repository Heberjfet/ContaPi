import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Settings = ({ onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/usuarios/${userId}`
        );
        
        setFormData({
          ...formData,
          nombre: response.data.nombre || "",
          email: response.data.email || "",
          password: "",
          newPassword: "",
          confirmPassword: ""
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar mensajes previos
    setError("");
    setSuccessMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    
    // Validación
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    
    // Si se quiere cambiar la contraseña, la actual es requerida
    if (formData.newPassword && !formData.password) {
      setError("Debes ingresar tu contraseña actual para cambiarla");
      setLoading(false);
      return;
    }
    
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No se encontró sesión de usuario");
      setLoading(false);
      return;
    }
    
    try {
      // Preparar datos para enviar (omitir confirmPassword)
      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email
      };
      
      // Solo incluir contraseñas si se está cambiando
      if (formData.newPassword) {
        dataToSend.password = formData.password;
        dataToSend.newPassword = formData.newPassword;
      }
      
      const response = await axios.put(
        `http://localhost:3001/usuarios/${userId}`,
        dataToSend
      );
      
      setSuccessMessage("Cambios guardados correctamente");
      
      // Limpiar campos de contraseña
      setFormData({
        ...formData,
        password: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      // Si hay una función onSave, llamarla después de un segundo
      if (onSave) {
        setTimeout(() => {
          onSave();
        }, 1000);
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setError(
        error.response?.data?.error || 
        "Error al guardar cambios. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <hr className="my-4" />
        <h5>Cambiar contraseña</h5>
        <p className="text-muted small">Deja en blanco para mantener la contraseña actual</p>
        
        <div className="mb-3">
          <label className="form-label">Contraseña actual</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Confirmar nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="d-flex justify-content-between mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
          
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
            disabled={loading}
          >
            Salir de la cuenta
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;