import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaCog,
  FaDownload
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const RegistrarTransaccion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const nombreEmpresa = location.state?.nombreEmpresa || "Empresa no especificada";
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const nombreUsuario = usuario?.nombre || "Usuario";
  const [fechaActual, setFechaActual] = useState("");

  useEffect(() => {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setFechaActual(fechaFormateada);
  }, []);

  const [formData, setFormData] = useState({
    fecha: "",
    descripcion: "",
    cuenta: "",
    subcuenta: "",
    monto: "",
  });

  const [transacciones, setTransacciones] = useState([]);
  const [archivoXML, setArchivoXML] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fecha || !formData.descripcion || !formData.cuenta || !formData.monto) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    setTransacciones([...transacciones, formData]);
    setFormData({ fecha: "", descripcion: "", cuenta: "", subcuenta: "", monto: "" });
  };

  const handleXMLChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.name.endsWith(".xml")) {
      setArchivoXML(archivo);
      alert(`Archivo seleccionado: ${archivo.name}`);
    } else {
      alert("Por favor selecciona un archivo XML válido.");
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <nav className="navbar navbar-dark py-3" style={{ backgroundColor: "#160041" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button className="btn btn-link text-white me-3" onClick={() => setShowSidebar(!showSidebar)}>
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
         <Link to="/homepage" className="navbar-brand mb-0 text-white text-decoration-none">
            Contapi
        </Link>
            </div>
          </div>
          <span className="text-white">Bienvenido, {nombreUsuario}</span>
        </div>
      </nav>
        {/* Contenido principal */}
        <main className="flex-grow-1 p-4 bg-light">
          <div className="text-center mb-4">
            <h2 className="fw-bold">{nombreEmpresa}</h2>
            <p className="text-muted mb-1 fs-5">Balance General</p>
            <p className="text-muted">{fechaActual}</p>
          </div>

          <div className="card shadow-sm p-4 mb-4">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-2">
                <label className="form-label">Fecha</label>
                <input type="date" name="fecha" className="form-control" value={formData.fecha} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Descripción</label>
                <input type="text" name="descripcion" className="form-control" value={formData.descripcion} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Cuenta</label>
                <input type="text" name="cuenta" className="form-control" value={formData.cuenta} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Subcuenta</label>
                <input type="text" name="subcuenta" className="form-control" value={formData.subcuenta} onChange={handleChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Monto</label>
                <input type="number" name="monto" className="form-control" value={formData.monto} onChange={handleChange} required />
              </div>
              <div className="col-12 d-flex justify-content-center gap-3 mt-3">
                <button type="submit" className="btn btn-primary">
                  Registrar Transacción
                </button>
                <label className="btn btn-secondary mb-0">
                  Subir XML
                  <input type="file" accept=".xml" onChange={handleXMLChange} style={{ display: "none" }} />
                </label>
              </div>
            </form>
          </div>

          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">Libro Diario</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Cuenta</th>
                    <th>Subcuenta</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {transacciones.map((transaccion, index) => (
                    <tr key={index}>
                      <td>{transaccion.fecha}</td>
                      <td>{transaccion.descripcion}</td>
                      <td>{transaccion.cuenta}</td>
                      <td>{transaccion.subcuenta}</td>
                      <td>${parseFloat(transaccion.monto).toFixed(2)}</td>
                    </tr>
                  ))}
                  {transacciones.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No hay transacciones registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
  );
};

export default RegistrarTransaccion;
