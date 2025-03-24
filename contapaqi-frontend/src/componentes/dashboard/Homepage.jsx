import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBars, FaCog, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';
import AgregarEmpresa from '../empresa/AgregarEmpresa';

function Homepage() {
    const location = useLocation();
    const navigate = useNavigate();
    const nombre = location.state?.nombre || 'Usuario';

    const [showModal, setShowModal] = useState(false);

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
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agregar Empresa</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <AgregarEmpresa />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Homepage;