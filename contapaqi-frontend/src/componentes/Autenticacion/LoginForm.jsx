import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa'; // Importa el ícono de flecha

function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', formData);
            alert('Inicio de sesión exitoso');
            // Guardar el usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify(response.data));
            navigate('/homepage', { state: { nombre: response.data.nombre } }); // Pasar el nombre a Homepage
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="w-100" style={{ maxWidth: '400px' }}>
                {/* Botón de flecha para regresar a Login */}
                <button
                    type="button"
                    className="btn btn-link p-0 mb-3"
                    onClick={() => navigate('/')} // Redirige a la página de Login
                >
                    <FaArrowLeft size={24} /> {/* Ícono de flecha */}
                </button>
                <h2 className="text-center">Iniciar Sesión</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Ristrarse</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;