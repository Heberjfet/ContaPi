import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBars, FaCog, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

function Homepage() {
    const location = useLocation();
    const navigate = useNavigate();
    const nombre = location.state?.nombre || 'Usuario';

    const empresas = [
        { nombre: "Pizza's Mora S.A.", tipo: "Balance General", favorita: true },
        { nombre: "Taquerias don Omar", tipo: "Libro Diario", favorita: false },
        { nombre: "Impresiones Heber", tipo: "Libro Mayor", favorita: false }
    ];

    return (
        <div className="d-flex">
            <aside className="sidebar">
                <button className="menu-btn"><FaBars /></button>
                <nav>
                    <button className="sidebar-btn">Balance</button>
                    <button className="sidebar-btn">Libro Diario</button>
                    <button className="sidebar-btn">Libro Mayor</button>
                    <button className="sidebar-btn">Ajustes</button>
                </nav>
                <button className="settings-btn"><FaCog /></button>
            </aside>
            <main className="content">
                <div className="header">
                    <h1>Bienvenido, {nombre}</h1>
                    <button className="btn btn-primary" onClick={() => navigate('/agregar-empresa')}>
                        <FaPlus /> Agregar Empresa
                    </button>
                </div>
                <div className="filter">
                    <button className="filter-btn active">Recientes</button>
                    <button className="filter-btn">Todos</button>
                </div>
                <ul className="company-list">
                    {empresas.map((empresa, index) => (
                        <li key={index} className="company-item">
                            <div className="company-icon"></div>
                            <div className="company-info">
                                <h4>{empresa.nombre}</h4>
                                <p>{empresa.tipo}</p>
                                <small>content going up to the cloud.</small>
                            </div>
                            <button className="fav-btn">
                                {empresa.favorita ? <FaHeart color="red" /> : <FaRegHeart />}
                            </button>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default Homepage;