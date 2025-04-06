import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/recuperar-password", { email });
      setMessage(
        "Se ha enviado un enlace a tu correo para recuperar tu contraseña"
      );
      setError("");
    } catch (err) {
      setError("No se encontró una cuenta con ese correo electrónico");
      setMessage("");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#00294f" }}
    >
      <div
        className="card text-center p-4 shadow"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
      >
        <div className="text-start">
          <button
            type="button"
            className="btn btn-link text-dark p-0"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft size={20} />
          </button>
        </div>
        <div className="mb-4">
          <img
            src="public/access-control.png"
            alt="Lock Icon"
            style={{ width: "80px", height: "80px", borderRadius: "20%" }}
          />
        </div>
        <h4 className="mb-2 text-dark">Recuperar Contraseña</h4>
        <p className="text-muted mb-4">
          Ingresa tu correo electrónico para recuperar tu contraseña
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold mb-3">
            Enviar enlace de recuperación
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecuperarPassword;
