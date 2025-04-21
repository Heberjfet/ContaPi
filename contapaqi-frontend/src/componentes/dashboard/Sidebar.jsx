import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaCog,
  FaBalanceScale,
  FaBook,
  FaChartLine,
} from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // Importar componentes de React-Bootstrap
import Settings from "./Ajustes"; // Importar el componente Ajustes
import "../styles/Sidebar.css";

function Sidebar({
  setVistaActual,
  vistaActual,
  isSidebarOpen,
  toggleSidebar,
}) {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false); // Estado para controlar el modal

  const handleOpenSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);

  const menuItems = [
    { name: "Balance General", icon: <FaBalanceScale /> },
    { name: "Libro Diario", icon: <FaBook /> },
    { name: "Libro Mayor", icon: <FaChartLine /> },
  ];

  return (
    <>
      <div
        className={`sidebar-container bg-gradient-dark text-white ${
          isSidebarOpen ? "open" : "closed"
        }`}
        style={{
          width: isSidebarOpen ? "200px" : "0",
          transition: "width 0.3s ease",
        }}
      >
        <div className="d-flex flex-column h-100">
          <nav className="mb-4">
            <div className="menu-title ps-2 mb-2 p-2">REPORTES</div>
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
              onClick={handleOpenSettings} // Abrir el modal
            >
              <span className="menu-icon">
                <FaCog />
              </span>
              <span className="menu-text">Ajustes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Ajustes */}
      <Modal show={showSettings} onHide={handleCloseSettings} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">⚙️ Ajustes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Settings />
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={handleCloseSettings}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Sidebar;
