import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AgregarEmpresa() {
  const [formData, setFormData] = useState({
    nombre: '',
    rfc: '',
    direccion: '',
    telefono: '',
    email: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.rfc ||
      !formData.direccion ||
      !formData.telefono ||
      !formData.email
    ) {
      alert('Debes llenar el formulario completo');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario || !usuario.id) {
      setError(
        'No se encontró la información del usuario. Por favor, inicia sesión nuevamente.'
      );
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/empresas', {
        ...formData,
        usuario_id: usuario.id,
      });

      if (
        window.confirm('Empresa agregada exitosamente. ¿Aceptar?')
      ) {
        navigate('/registrartransaccion', {
          state: { nombreEmpresa: formData.nombre },
        });
      }
    } catch (error) {
      console.error('Error al agregar empresa:', error);
      setError('Error al agregar empresa');
    }
  };

  return (
    <div className="container mt-3">
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">RFC</label>
          <input
            type="text"
            name="rfc"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Agregar Empresa
        </button>
      </form>
    </div>
  );
}

export default AgregarEmpresa;
