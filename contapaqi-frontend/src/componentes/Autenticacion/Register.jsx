import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/usuarios",
        formData
      );
      alert("Registro exitoso");
      // Guardar el usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(response.data));
      navigate("/homepage", { state: { nombre: formData.nombre } }); // Pasar el nombre a Homepage
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error en el registro");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#1E3A8A" }}
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
          <i className="fi fi-rs-user" style={{ fontSize: "48px" }}></i>
        </div>
        <h4 className="mb-2 text-dark">Registro</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold mb-3">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
