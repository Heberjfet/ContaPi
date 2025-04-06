import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaBars,
  FaCog,
  FaPlus,
  FaDownload,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import AgregarEmpresa from "../empresa/AgregarEmpresa";

function Homepage() {
  const location = useLocation();
  const navigate = useNavigate();
  const nombre = location.state?.nombre || "Usuario";

  const [showSidebar, setShowSidebar] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [vistaActual, setVistaActual] = useState("Recientes");
  const [empresas, setEmpresas] = useState([
    {
      id: 1,
      nombre: "Pizza's Mora S.A.",
      tipo: "Balance General",
      favorita: true,
      fecha: new Date(2024, 2, 1),
    },
    {
      id: 2,
      nombre: "Taquerias don Omar",
      tipo: "Libro Diario",
      favorita: false,
      fecha: new Date(2024, 2, 15),
    },
    {
      id: 3,
      nombre: "Impresiones Heber",
      tipo: "Libro Mayor",
      favorita: false,
      fecha: new Date(2024, 2, 20),
    },
  ]);

  // Funcionalidad de favoritos
  const handleFavorito = (id) => {
    setEmpresas(
      empresas.map((empresa) =>
        empresa.id === id
          ? { ...empresa, favorita: !empresa.favorita }
          : empresa
      )
    );
  };

  // Filtrado de empresas
  const empresasFiltradas = () => {
    const copiaEmpresas = [...empresas];
    switch (vistaActual) {
      case "Recientes":
        return copiaEmpresas.sort((a, b) => b.fecha - a.fecha).slice(0, 2);
      case "Todos":
        return copiaEmpresas;
      default:
        return copiaEmpresas.filter((e) => e.tipo === vistaActual);
    }
  };

  // Añadir nueva empresa
  const handleAgregarEmpresa = (nuevaEmpresa) => {
    setEmpresas([
      ...empresas,
      {
        id: empresas.length + 1,
        ...nuevaEmpresa,
        favorita: false,
        fecha: new Date(),
      },
    ]);
    setShowModal(false);
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Navbar superior */}
      <nav
        className="navbar navbar-dark py-3"
        style={{ backgroundColor: "#160041" }}
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-link text-white me-3"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <FaBars size={20} />
            </button>
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6194/6194029.png"
                alt="Logo"
                width="30"
                height="30"
                className="me-2"
              />
              <span className="navbar-brand mb-0">Contapi</span>
            </div>
          </div>
          <span className="text-white">Bienvenido, {nombre}</span>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="bg-dark text-white p-3" style={{ width: "120px" }}>
            <div className="d-flex flex-column h-100">
              <nav className="mb-4">
                <h5 className="text-muted mb-3">CONTAPI</h5>
                <div className="d-flex flex-column gap-2">
                  {["Balance General", "Libro Diario", "Libro Mayor"].map(
                    (item) => (
                      <button
                        key={item}
                        className="btn btn-dark text-start text-white py-2"
                        onClick={() => {
                          setVistaActual(item);
                          alert(`Vista cambiada a: ${item}`);
                        }}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </nav>

              <div className="mt-auto border-top pt-3">
                <button
                  className="btn btn-link text-white text-decoration-none d-block w-100 text-start mb-2"
                  onClick={() => {
                    alert("Descargando todos los registros...");
                    // Lógica de descarga aquí
                  }}
                >
                  <FaDownload className="me-2" /> Descarga Masiva
                </button>
                <button
                  className="btn btn-link text-white text-decoration-none d-block w-100 text-start mb-2"
                  onClick={() => navigate("/ajustes")}
                >
                  <FaCog className="me-2" /> Ajustes
                </button>
                <button
                  className="btn btn-link text-white text-decoration-none d-block w-100 text-start"
                  onClick={() => navigate("/configuracion")}
                ></button>
              </div>
            </div>
          </aside>
        )}

        {/* Contenido principal */}
        <main className="flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Empresas</h2>
              <p className="text-muted mb-0">Vista: {vistaActual}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <FaPlus className="me-2" /> Agregar Empresa
            </button>
          </div>

          <div className="mb-4">
            <div className="btn-group">
              <button
                className={`btn ${
                  vistaActual === "Recientes"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setVistaActual("Recientes")}
              >
                Recientes
              </button>
              <button
                className={`btn ${
                  vistaActual === "Todos"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setVistaActual("Todos")}
              >
                Todos
              </button>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-0">
              {empresasFiltradas().map((empresa) => (
                <div
                  key={empresa.id}
                  className="d-flex justify-content-between align-items-center p-3 border-bottom"
                >
                  <div>
                    <h5 className="mb-1">{empresa.nombre}</h5>
                    <small className="text-muted">{empresa.tipo}</small>
                  </div>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => handleFavorito(empresa.id)}
                  >
                    {empresa.favorita ? (
                      <FaHeart color="red" size={20} />
                    ) : (
                      <FaRegHeart size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal para agregar empresa */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Empresa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <AgregarEmpresa
                  onAgregar={handleAgregarEmpresa}
                  onCancelar={() => setShowModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
