import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    return (
        <div className="container" style={{ backgroundColor: '#1E3A8A' }}>
            <div className="card text-center p-4 shadow" style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem' }}>
                <div className="mb-4">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="User Icon"
                        style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                    />
                </div>
                <h4 className="mb-2 text-dark">Iniciar Sesión</h4>
                <p className="text-muted mb-4">o Registrarse</p>
                <div className="d-grid gap-2">
                    <Link to="/login" className="btn btn-primary fw-bold">
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="btn btn-outline-primary fw-bold">
                        Registrarse
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
