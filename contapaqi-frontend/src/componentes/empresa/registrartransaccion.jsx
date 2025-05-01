import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../dashboard/Navbar";
import Sidebar from "../dashboard/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const RegistrarTransaccion = () => {
  const location = useLocation();
  const { nombreEmpresa, empresaId } = location.state || {
    nombreEmpresa: "Empresa no especificada",
    empresaId: null,
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [fechaActual, setFechaActual] = useState("");
  const [formData, setFormData] = useState({
    fecha: "",
    descripcion: "",
    cuenta: "", // ID cuenta madre
    subcuenta: "", // ID subcuenta
    monto: "",
  });
  const [transacciones, setTransacciones] = useState([]);
  const [archivoXML, setArchivoXML] = useState(null);
  const [cuentasMadre, setCuentasMadre] = useState([]);
  const [todasSubcuentas, setTodasSubcuentas] = useState([]);
  const [loadingSubcuentas, setLoadingSubcuentas] = useState(false);

  useEffect(() => {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setFechaActual(fechaFormateada);
  }, []);

  useEffect(() => {
    if (!empresaId) return;
    fetch(`http://localhost:3003/cuentas-madre?empresa_id=${empresaId}`)
      .then(res => res.json())
      .then(data => setCuentasMadre(data))
      .catch(err => {
        console.error(err);
        alert("Error al cargar cuentas madre.");
      });
  }, [empresaId]);

  useEffect(() => {
    if (!empresaId) {
      setTodasSubcuentas([]);
      return;
    }
    setLoadingSubcuentas(true);
    fetch(`http://localhost:3004/subcuentas?empresa_id=${empresaId}`)
      .then(res => res.json())
      .then(data => setTodasSubcuentas(data))
      .catch(err => {
        console.error(err);
        alert("Error al cargar subcuentas.");
        setTodasSubcuentas([]);
      })
      .finally(() => setLoadingSubcuentas(false));
  }, [empresaId]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { fecha, descripcion, cuenta, monto, subcuenta } = formData;
    if (!fecha || !descripcion || !cuenta || !monto) {
      alert("Los campos Fecha, Descripción, Cuenta Madre y Monto son obligatorios.");
      return;
    }

    const nueva = {
      fecha,
      descripcion,
      monto: parseFloat(monto),
      empresa_id: empresaId,
      cuenta_madre_id: cuenta,
      subcuenta_id: subcuenta || null,
    };

    try {
      const res = await fetch("http://localhost:3005/transacciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva),
      });
      if (!res.ok) throw await res.json();
      const result = await res.json();
      alert(result.message || "Transacción registrada con éxito");

      const cm = cuentasMadre.find(c => c.id.toString() === cuenta);
      const sc = todasSubcuentas.find(s => s.id.toString() === subcuenta);
      setTransacciones(prev => [
        ...prev,
        {
          id: result.id,
          fecha,
          descripcion,
          monto,
          cuentaNombre: cm ? cm.nombre : cuenta,
          subcuentaNombre: sc ? sc.nombre : (subcuenta ? subcuenta : "-"),
        }
      ]);

      setFormData({ fecha: "", descripcion: "", cuenta: "", subcuenta: "", monto: "" });
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al guardar la transacción.");
    }
  };

  const handleXMLChange = e => {
    const file = e.target.files[0];
    if (file?.name.endsWith('.xml')) {
      setArchivoXML(file);
      alert(`Archivo seleccionado: ${file.name}`);
    } else {
      alert("Selecciona un archivo XML válido.");
      e.target.value = null;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} vistaActual="Transacciones" />
      <div className="flex-grow-1" style={{ marginLeft: isSidebarOpen ? 200 : 0, transition: '0.3s', minHeight: '100vh' }}>
        <Navbar nombre="Usuario" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="p-4 bg-light">
          <div className="text-center mb-4">
            <h2 className="fw-bold">{nombreEmpresa}</h2>
            <p className="text-muted fs-5">Registrar Transacción</p>
            <p className="text-muted">{fechaActual}</p>
          </div>

          <div className="card shadow-sm p-4 mb-4">
            <form onSubmit={handleSubmit} className="row g-3">
              {/* Fecha */}
              <div className="col-md-2">
                <label htmlFor="fecha" className="form-label">Fecha</label>
                <input type="date" id="fecha" name="fecha" className="form-control" value={formData.fecha} onChange={handleChange} required />
              </div>
              {/* Descripción */}
              <div className="col-md-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <input type="text" id="descripcion" name="descripcion" className="form-control" value={formData.descripcion} onChange={handleChange} required />
              </div>
              {/* Cuenta Madre */}
              <div className="col-md-3">
                <label htmlFor="cuenta" className="form-label">Cuenta Madre</label>
                <select id="cuenta" name="cuenta" className="form-select" value={formData.cuenta} onChange={handleChange} required>
                  <option value="" disabled>Selecciona una cuenta madre</option>
                  {cuentasMadre.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              {/* Subcuenta */}
              <div className="col-md-3">
                <label htmlFor="subcuenta" className="form-label">Subcuenta</label>
                <select id="subcuenta" name="subcuenta" className="form-select" value={formData.subcuenta} onChange={handleChange}>
                  <option value="">{loadingSubcuentas ? 'Selecciona una subcuenta' : (todasSubcuentas.length ? 'Selecciona una subcuenta' : 'Sin subcuentas')}</option>
                  {todasSubcuentas.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
              {/* Monto */}
              <div className="col-md-2">
                <label htmlFor="monto" className="form-label">Monto</label>
                <input type="number" id="monto" name="monto" className="form-control" step="0.01" value={formData.monto} onChange={handleChange} required />
              </div>
              {/* Botones */}
              <div className="col-12 d-flex justify-content-center gap-3 mt-4">
                <button type="submit" className="btn btn-primary px-4">Registrar Transacción</button>
                <label className="btn btn-secondary mb-0 px-4">
                  Subir XML
                  <input type="file" accept=".xml" onChange={handleXMLChange} style={{ display: "none" }} onClick={e => e.target.value = null} />
                </label>
              </div>
            </form>
          </div>

          <div className="card p-3 shadow-sm">
            <h4 className="text-center mb-3">Libro Diario</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle text-center">
                <thead className="table-dark">
                  <tr><th>Fecha</th><th>Descripción</th><th>Cuenta</th><th>Subcuenta</th><th>Monto</th></tr>
                </thead>
                <tbody>
                  {transacciones.length === 0 && (
                    <tr><td colSpan={5} className="text-muted fst-italic py-3">No hay transacciones registradas.</td></tr>
                  )}
                  {transacciones.map(t => (
                    <tr key={t.id}>
                      <td>{new Date(t.fecha).toLocaleDateString('es-MX')}</td>
                      <td>{t.descripcion}</td>
                      <td>{t.cuentaNombre}</td>
                      <td>{t.subcuentaNombre}</td>
                      <td>${t.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistrarTransaccion;