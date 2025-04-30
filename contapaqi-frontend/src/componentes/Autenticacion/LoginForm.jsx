import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "" 
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        formData
      );
      
      // Solo almacenar el ID en localStorage
      localStorage.setItem("userId", response.data.id);
      navigate("/homepage");
      
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError(
        error.response?.data?.error || 
        "Error al iniciar sesión. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#00294f" }}
    >
      <div 
        className="card text-center p-4 shadow"
        style={{ 
          width: "100%", 
          maxWidth: "400px", 
          borderRadius: "1rem" 
        }}
      >
        <div className="mb-4">
          <i 
            className="fi fi-rs-user" 
            style={{ fontSize: "48px" }}
          ></i>
        </div>
        
        <h4 className="mb-2 text-dark">Iniciar Sesión</h4>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-3 text-start">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-bold mb-3"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <Link
          to="/register"
          className="btn btn-outline-primary w-100 fw-bold mb-3"
        >
          Registrarse
        </Link>
        
        <p className="text-muted mt-2">
          <Link to="/recuperacion" className="text-decoration-none">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;