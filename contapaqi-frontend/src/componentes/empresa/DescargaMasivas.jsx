import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";   // <-- Importamos la función
import { FaFilePdf } from "react-icons/fa";
import Navbar from "../dashboard/Navbar";
import Sidebar from "../dashboard/Sidebar";
import "../styles/DescargasMasivas.css";

const DescargaMasivas = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [registros, setRegistros]       = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3006/descarga_masiva")
      .then(({ data }) => {
        setRegistros(data);
        setCheckedItems(new Array(data.length).fill(true));
        setError(null);
      })
      .catch((err) => {
        console.error("Error al obtener los registros:", err);
        setError("No se pudo cargar la información.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCheckChange = (idx) => {
    const updated = [...checkedItems];
    updated[idx] = !updated[idx];
    setCheckedItems(updated);
  };

  const exportToPDF = () => {
    // 1) Generamos el documento
    const doc = new jsPDF({
      unit: "pt",
      format: "letter",
    });
    doc.setFontSize(14);
    doc.text("Descarga Masiva de Documentos", 40, 50);

    // 2) Formateamos las filas seleccionadas
    const rows = registros
      .filter((_, idx) => checkedItems[idx])
      .map((r) => [r.folio_fiscal, r.rfc, r.nombre_razon_social]);

    if (rows.length === 0) {
      return alert("Selecciona al menos un registro para descargar.");
    }

    // 3) Llamamos al plugin pasándole el doc
    autoTable(doc, {
      startY: 80,
      head: [["Folio Fiscal", "RFC Emisor", "Nombre o Razón Social"]],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { left: 40, right: 40 },
    });

    // 4) Descarga
    doc.save("descarga_masiva.pdf");
  };

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <div className="d-flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        vistaActual="Descargas"
      />

      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? 200 : 0,
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <Navbar
          nombre={localStorage.getItem("nombre") || "Usuario"}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="container py-4">
          <h2 className="page-title">Descarga Masiva de Documentos</h2>

          {loading && <p>Cargando registros...</p>}
          {error   && <p className="text-danger">{error}</p>}

          {!loading && !error && registros.length === 0 && (
            <p>No hay registros disponibles.</p>
          )}

          {!loading && !error && registros.length > 0 && (
            <>
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
                    {registros.map((reg, idx) => (
                      <tr key={reg.id}>
                        <td className="checkbox-column">
                          <input
                            type="checkbox"
                            checked={checkedItems[idx]}
                            onChange={() => handleCheckChange(idx)}
                          />
                        </td>
                        <td>{reg.folio_fiscal}</td>
                        <td>{reg.rfc}</td>
                        <td>{reg.nombre_razon_social}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="actions-container mt-4">
                <button
                  className="btn-action btn-secondary-action"
                  onClick={exportToPDF}
                >
                  <FaFilePdf className="me-2" />
                  Descargar PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescargaMasivas;
