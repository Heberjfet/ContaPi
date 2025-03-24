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
        tipo_contabilidad: 'Balance General'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Obtener el usuario desde localStorage
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        // Verificar si el usuario existe
        if (!usuario || !usuario.id) {
            setError('No se encontró la información del usuario. Por favor, inicia sesión nuevamente.');
            navigate('/login'); // Redirigir al login
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/empresas', {
                ...formData,
                usuario_id: usuario.id
            });
            alert('Empresa agregada exitosamente');
            navigate('/homepage');
        } catch (error) {
            console.error('Error al agregar empresa:', error);
            setError('Error al agregar empresa');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Agregar Nueva Empresa</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="nombre" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">RFC</label>
                    <input type="text" name="rfc" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" name="direccion" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" name="telefono" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de Contabilidad</label>
                    <select name="tipo_contabilidad" className="form-control" onChange={handleChange} required>
                        <option value="Balance General">Balance General</option>
                        <option value="Libro Diario">Libro Diario</option>
                        <option value="Libro Mayor">Libro Mayor</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Agregar Empresa</button>
            </form>
        </div>
    );
}

export default AgregarEmpresa;