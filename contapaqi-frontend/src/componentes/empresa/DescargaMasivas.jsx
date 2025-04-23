import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import Navbar from "../dashboard/Navbar"; // Ajustar ruta según estructura
import Sidebar from "../dashboard/Sidebar"; // Ajustar ruta según estructura
import "../styles/DescargasMasivas.css";

const DescargaMasivas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [checkedItems, setCheckedItems] = useState(Array(6).fill(true));
  
  // 🟠 Mantenemos todas las variables originales
  const nombre = location.state?.nombre || localStorage.getItem("nombre") || "Usuario";

  // ✅ Funcionalidad original intacta
  const handleCheckChange = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const handleDownload = (type) => {
    console.log(`Iniciando descarga ${type}`);
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="d-flex">
      {/* 🔄 Nuevo Sidebar integrado */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        vistaActual="Descargas"
      />

      <div 
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? "200px" : "0",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh"
        }}
      >
        {/* 🔄 Nuevo Navbar integrado */}
        <Navbar 
          nombre={nombre}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* 🟢 Contenido original SIN CAMBIOS */}
        <div className="container">
          <h2 className="page-title">Descarga Masiva de Documentos</h2>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="checkbox-column">Selección</th>
                  <th>Folio Fiscal</th>
                  <th>RFC Emisor</th>
                  <th>Nombre o Razón Social</th>
                </tr>
              </thead>
              <tbody>
                {checkedItems.map((isChecked, index) => (
                  <tr key={index}>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckChange(index)}
                      />
                    </td>
                    <td>
                      <div className="data-placeholder"></div>
                    </td>
                    <td>
                      <div className="data-placeholder"></div>
                    </td>
                    <td>
                      <div className="data-placeholder"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="actions-container mt-4">
            <button
              className="btn-action btn-primary-action"
              onClick={() => handleDownload("excel")}
            >
              <FaFileExcel className="me-2" /> Descarga Masiva
            </button>
            <button
              className="btn-action btn-secondary-action"
              onClick={() => handleDownload("pdf")}
            >
              <FaFilePdf className="me-2" /> Descarga Masiva PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescargaMasivas;