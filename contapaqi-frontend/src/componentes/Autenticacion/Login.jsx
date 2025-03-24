import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión o Registrarse</h2>
            <div className="d-grid gap-2">
                <Link to="/login" className="btn btn-primary">
                    Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-secondary">
                    Registrarse
                </Link>
            </div>
        </div>
    );
}

export default Login;