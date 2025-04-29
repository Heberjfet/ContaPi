import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

import AgregarEmpresa from "../empresa/AgregarEmpresa";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import EmpresasList from "./EmpresasList";

function Homepage() {
  const location = useLocation();
  const navigate = useNavigate();
  const nombre =
    location.state?.nombre || localStorage.getItem("nombre") || "Usuario";

  const [showModal, setShowModal] = useState(false);
  const [vistaActual, setVistaActual] = useState("Recientes");
  const [empresas, setEmpresas] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Obtener empresas desde el backend
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch("http://localhost:3002/empresas"); // Cambia el puerto si es necesario
        if (!response.ok) {
          throw new Error("Error al obtener las empresas");
        }
        const data = await response.json();
        const empresasConFechas = data.map((empresa) => ({
          ...empresa,
          fecha: new Date(empresa.fecha), // Convierte la fecha a un objeto Date
        }));
        setEmpresas(empresasConFechas);
      } catch (error) {
        console.error(error);
        alert("Hubo un problema al cargar las empresas.");
      }
    };

    fetchEmpresas();
  }, []);

  // Memoizar la función de filtrado
  const empresasFiltradas = useCallback(() => {
    const copiaEmpresas = [...empresas];
    switch (vistaActual) {
      case "Recientes":
        return copiaEmpresas.sort((a, b) => b.fecha - a.fecha).slice(0, 2);
      case "Todos":
        return copiaEmpresas;
      default:
        return copiaEmpresas.filter((e) => e.tipo === vistaActual);
    }
  }, [empresas, vistaActual]);

  const handleFavorito = useCallback((id) => {
    setEmpresas((prevEmpresas) =>
      prevEmpresas.map((empresa) =>
        empresa.id === id
          ? { ...empresa, favorita: !empresa.favorita }
          : empresa
      )
    );
  }, []);

  const handleAgregarEmpresa = useCallback((nuevaEmpresa) => {
    setEmpresas((prevEmpresas) => [
      ...prevEmpresas,
      {
        id: Date.now(), // Usar timestamp para IDs únicos
        ...nuevaEmpresa,
        favorita: false,
        fecha: new Date(),
      },
    ]);
    setShowModal(false);
  }, []);

  return (
    <div className="d-flex">
      <Sidebar
        setVistaActual={setVistaActual}
        vistaActual={vistaActual}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? "200px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Navbar
          nombre={nombre}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
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
                {["Recientes", "Todos"].map((vista) => (
                  <button
                    key={vista}
                    className={`btn ${
                      vistaActual === vista
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setVistaActual(vista)}
                  >
                    {vista}
                  </button>
                ))}
              </div>
            </div>

            <EmpresasList
              empresas={empresasFiltradas()}
              handleFavorito={handleFavorito}
            />
          </main>
        </div>

        {/* Modal para agregar empresa */}
        {showModal && (
          <div
            className="modal d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
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
    </div>
  );
}

export default Homepage;
