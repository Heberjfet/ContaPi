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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        "http://localhost:3001/usuarios",
        formData
      );
      
      // Guardar información mínima del usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify({
        id: response.data.id,
        nombre: response.data.nombre,
        email: response.data.email
      }));
      
      // Redireccionar al usuario a la página principal
      navigate("/homepage");
    } catch (error) {
      console.error("Error al registrar:", error);
      setError(
        error.response?.data?.error || 
        "Error en el registro. Por favor, intente nuevamente."
      );
    } finally {
      setLoading(false);
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
          <i className="fi fi-rs-user" style={{ fontSize: "48px" }}></i>
        </div>
        <h4 className="mb-2 text-dark">Registro</h4>
        {error && <div className="alert alert-danger">{error}</div>}
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
          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-bold mb-3"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-muted mt-2">
          ¿Ya tienes cuenta? <Link to="/" className="text-decoration-none">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;