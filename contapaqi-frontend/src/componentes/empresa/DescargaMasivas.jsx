import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";

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
            <div className="d-flex align-items-center">
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

      <div className="container mt-4">
        <table className="table table-bordered table-hover">
          <thead>
            <tr className="bg-primary text-white">
              <th>Selección</th>
              <th>Folio Fiscal</th>
              <th>RFC Emisor</th>
              <th>Nombre o Razón Social</th>
            </tr>
          </thead>
          <tbody>
            {checkedItems.map((isChecked, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isChecked}
                    onChange={() => handleCheckChange(index)}
                  />
                </td>
                <td>
                  <div className="bg-secondary p-2 rounded"></div>
                </td>
                <td>
                  <div className="bg-secondary p-2 rounded"></div>
                </td>
                <td>
                  <div className="bg-secondary p-2 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row mt-4">
          <div className="col d-flex justify-content-center gap-3">
            <button
              className="btn btn-primary"
              onClick={() => handleDownload("excel")}
            >
              Descarga Masiva
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleDownload("pdf")}
            >
              Descarga Masiva PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescargaMasivas;
