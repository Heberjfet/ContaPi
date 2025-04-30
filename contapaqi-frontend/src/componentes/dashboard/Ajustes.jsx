import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEnvelope, FaLock, FaCheck, FaSave } from "react-icons/fa";
import axios from "axios";

const Settings = ({ onSave, userData }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar datos del usuario cuando el componente monta o cuando userData cambia
  useEffect(() => {
    // Primero intentamos usar los datos pasados por props
    if (userData && userData.nombre) {
      setUsername(userData.nombre);
      setEmail(userData.email || "");
      
      // Obtener ID del usuario del localStorage para actualizaciones
      const usuarioGuardado = localStorage.getItem("usuario");
      if (usuarioGuardado) {
        const { id } = JSON.parse(usuarioGuardado);
        setUserId(id);
      }
    } else {
      // Como respaldo, intentamos obtener datos del localStorage
      const usuarioGuardado = localStorage.getItem("usuario");
      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado);
          setUsername(usuario.nombre || "");
          setEmail(usuario.email || "");
          setUserId(usuario.id);
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
        }
      }
    }
  }, [userData]);

  const handleSave = async () => {
    // Validaciones básicas
    if (!username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }

    if (!email.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");

    try {
      // Datos a actualizar
      const datosActualizados = {
        nombre: username,
        email: email
      };

      // Solo agregar contraseña si se ingresó una nueva
      if (password) {
        datosActualizados.password = password;
      }

      // Hacer la solicitud de actualización al servidor
      const response = await axios.put(
        `http://localhost:3001/usuarios/${userId}`,
        datosActualizados
      );

      // Actualizar los datos en localStorage con los datos actualizados del servidor
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      const usuarioActualizado = {
        ...usuarioGuardado,
        nombre: username,
        email: email
      };
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      // Notificar éxito
      setSuccessMessage("Cambios guardados correctamente");
      
      // Forzar la recarga de datos en la aplicación principal
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
        detail: usuarioActualizado 
      }));
      
      // Limpiamos los campos de contraseña
      setPassword("");
      setConfirmPassword("");
      
      // Cerrar con temporizador
      setTimeout(() => {
        setSuccessMessage("");
        // Cerrar el modal después de guardar
        if (onSave) onSave();
      }, 1500);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError("Error al guardar los cambios. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="container py-3">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
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
          <h4 className="card-title mb-4 border-bottom pb-2 text-primary">
            <FaUser className="me-2" /> Información del perfil
          </h4>
          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">
                  <FaUser className="me-2 text-primary" /> Nombre de usuario
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su nombre"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">
                  <FaEnvelope className="me-2 text-primary" /> Correo
                  electrónico
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg bg-light"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
            <h4 className="mt-5 mb-4 border-bottom pb-2 text-primary">
              <FaLock className="me-2" /> Cambiar contraseña
            </h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">
                  <FaLock className="me-2 text-primary" /> Nueva contraseña
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg bg-light"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">
                  <FaCheck className="me-2 text-primary" /> Confirmar contraseña
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg bg-light"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
              <button
                type="button"
                className="btn btn-primary btn-lg px-5 py-2"
                onClick={handleSave}
              >
                <FaSave className="me-2" /> Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;