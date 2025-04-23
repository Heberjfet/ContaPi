import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaFileExcel, FaFilePdf } from "react-icons/fa";
import "../styles/DescargasMasivas.css";

const DescargaMasivas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [checkedItems, setCheckedItems] = useState([
    true,
    true,
    true,
    true,
    true,
    true
  ]);
  const nombre =
    location.state?.nombre || localStorage.getItem("nombre") || "Usuario";

  const handleCheckChange = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const handleDownload = (type) => {
    console.log(`Iniciando descarga ${type}`);
    // Aquí irá la lógica de descarga
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
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
            <div 
              className="d-flex align-items-center"
              onClick={() => navigate('/homepage')}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/logo.png"
                alt="Logo Contapi"
                width="50"
                height="50"
                className="me-2"
              />
              <span className="navbar-brand mb-0">Contapi</span>
            </div>
          </div>
          <span className="text-white">Bienvenido, {nombre}</span>
        </div>
      </nav>
     
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
       
        <div className="actions-container">
          <button
            className="btn-action btn-primary-action"
            onClick={() => handleDownload("excel")}
          >
            <FaFileExcel style={{ marginRight: "8px" }} /> Descarga Masiva
          </button>
          <button
            className="btn-action btn-secondary-action"
            onClick={() => handleDownload("pdf")}
          >
            <FaFilePdf style={{ marginRight: "8px" }} /> Descarga Masiva PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescargaMasivas;