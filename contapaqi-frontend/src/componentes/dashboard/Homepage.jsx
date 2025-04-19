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

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem("empresas", JSON.stringify(empresas));
  }, [empresas]);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const empresasGuardadas = localStorage.getItem("empresas");
    if (empresasGuardadas) {
      try {
        // Convertir las fechas string de vuelta a objetos Date
        const parsed = JSON.parse(empresasGuardadas);
        const empresasConFechas = parsed.map((empresa) => ({
          ...empresa,
          fecha: new Date(empresa.fecha),
        }));
        setEmpresas(empresasConFechas);
      } catch (e) {
        console.error("Error al cargar empresas:", e);
      }
    }
  }, []);

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

  const toggleSidebar = useCallback(() => {
    setShowSidebar((prev) => !prev);
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar nombre={nombre} toggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1">
        {showSidebar && (
          <Sidebar setVistaActual={setVistaActual} vistaActual={vistaActual} />
        )}

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
  );
}

export default Homepage;
