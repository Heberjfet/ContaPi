import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    // Lógica para cerrar sesión
    alert("Has salido de la cuenta");
  };

  const handleSave = () => {
    // Lógica para guardar ajustes
    alert("Cambios guardados");
  };

  return (
    <div className="container mt-5">
      <h2>Ajustes</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          className="btn btn-danger ms-3"
          onClick={handleLogout}
        >
          Salir de la cuenta
        </button>
      </form>
    </div>
  );
};

export default Settings;
