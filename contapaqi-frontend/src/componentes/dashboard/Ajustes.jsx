import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEnvelope, FaLock, FaCheck, FaSave } from "react-icons/fa";

const Settings = ({ onSave }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    // Lógica para guardar ajustes
    alert("Cambios guardados");
    if (onSave) onSave(); // Llamar a la función onSave (cerrar modal)
  };

  return (
    <div className="container py-3">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
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
