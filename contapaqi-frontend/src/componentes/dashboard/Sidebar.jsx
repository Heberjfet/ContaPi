import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaCog,
  FaBalanceScale,
  FaBook,
  FaChartLine,
} from "react-icons/fa";
import "./Sidebar.css"; // Vamos a crear este archivo CSS para estilos adicionales

function Sidebar({ setVistaActual, vistaActual }) {
  const navigate = useNavigate();

  // Agregamos iconos a cada elemento del menú
  const menuItems = [
    { name: "Balance General", icon: <FaBalanceScale /> },
    { name: "Libro Diario", icon: <FaBook /> },
    { name: "Libro Mayor", icon: <FaChartLine /> },
  ];

  return (
    <aside className="sidebar-container bg-gradient-dark text-white">
      <div className="d-flex flex-column h-100">
        <div className="sidebar-header mb-4">
          <h5 className="mb-3 text-center">
            <span className="text-primary fw-bold">CONTA</span>
            <span className="text-light">PI</span>
          </h5>
          <div className="sidebar-divider"></div>
        </div>

        <nav className="mb-4">
          <div className="menu-title ps-2 mb-2">REPORTES</div>
          <div className="d-flex flex-column gap-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className={`sidebar-menu-item ${
                  vistaActual === item.name ? "active" : ""
                }`}
                onClick={() => setVistaActual(item.name)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="mt-auto">
          <div className="sidebar-divider"></div>
          <div className="menu-title ps-2 my-2">HERRAMIENTAS</div>

          <button
            className="sidebar-menu-item"
            onClick={() => navigate("/descarga-masiva")}
          >
            <span className="menu-icon">
              <FaDownload />
            </span>
            <span className="menu-text">Descarga Masiva</span>
          </button>

          <button
            className="sidebar-menu-item"
            onClick={() => navigate("/ajustes")}
          >
            <span className="menu-icon">
              <FaCog />
            </span>
            <span className="menu-text">Ajustes</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
