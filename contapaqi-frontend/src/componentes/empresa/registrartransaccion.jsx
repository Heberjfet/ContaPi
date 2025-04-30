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
    cuenta: "",
    subcuenta: "",
    monto: "",
  });
  const [transacciones, setTransacciones] = useState([]);
  const [archivoXML, setArchivoXML] = useState(null);
  const [cuentasMadre, setCuentasMadre] = useState([]);
  const [subcuentas, setSubcuentas] = useState([]); // Estado para las subcuentas

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
    const fetchCuentasMadre = async () => {
      try {
        const response = await fetch("http://localhost:3003/cuentas-madre"); // Cambia el puerto si es necesario
        if (!response.ok) {
          throw new Error("Error al obtener las cuentas madre");
        }
        const data = await response.json();
        setCuentasMadre(data);
      } catch (error) {
        console.error(error);
        alert("Hubo un problema al cargar las cuentas madre.");
      }
    };

    fetchCuentasMadre();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fecha ||
      !formData.descripcion ||
      !formData.cuenta ||
      !formData.monto
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    let subcuentaId = formData.subcuenta || null;

    // Guardar la subcuenta si no existe
    if (
      formData.subcuenta &&
      !subcuentas.some((s) => s.nombre === formData.subcuenta)
    ) {
      try {
        const response = await fetch("http://localhost:3004/subcuentas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: formData.subcuenta,
            cuenta_madre_id: formData.cuenta,
            empresa_id: empresaId,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al guardar la subcuenta");
        }

        const data = await response.json();
        subcuentaId = data.id;

        // Actualizar la lista de subcuentas localmente
        setSubcuentas([
          ...subcuentas,
          { id: data.id, nombre: formData.subcuenta },
        ]);
      } catch (error) {
        console.error(error);
        alert("Hubo un problema al guardar la subcuenta.");
        return;
      }
    }

    const nuevaTransaccion = {
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      monto: parseFloat(formData.monto),
      empresa_id: empresaId,
      cuenta_madre_id: formData.cuenta,
      subcuenta_id: subcuentaId,
    };

    try {
      const response = await fetch("http://localhost:3005/transacciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTransaccion),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la transacción");
      }

      const data = await response.json();
      alert(data.message);

      // Actualizar la lista de transacciones localmente
      setTransacciones([
        ...transacciones,
        { ...nuevaTransaccion, id: data.id },
      ]);
      setFormData({
        fecha: "",
        descripcion: "",
        cuenta: "",
        subcuenta: "",
        monto: "",
      });
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al guardar la transacción.");
    }
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
    <div className="d-flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        vistaActual="Transacciones"
      />

      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? "200px" : "0",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <Navbar
          nombre="Usuario"
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-grow-1 p-4 bg-light">
          <div className="text-center mb-4">
            <h2 className="fw-bold">{nombreEmpresa}</h2>
            <p className="text-muted mb-1 fs-5">Registrar Transacción</p>
            <p className="text-muted">{fechaActual}</p>
          </div>

          <div className="card shadow-sm p-4 mb-4">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-2">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  className="form-control"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  className="form-control"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Cuenta Madre</label>
                <select
                  name="cuenta"
                  className="form-control"
                  value={formData.cuenta}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una cuenta madre</option>
                  {cuentasMadre.map((cuenta) => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Subcuenta</label>
                <input
                  type="text"
                  name="subcuenta"
                  className="form-control"
                  list="subcuentas-list"
                  value={formData.subcuenta}
                  onChange={handleChange}
                />
                <datalist id="subcuentas-list">
                  {subcuentas.map((subcuenta) => (
                    <option key={subcuenta.id} value={subcuenta.nombre} />
                  ))}
                </datalist>
              </div>
              <div className="col-md-2">
                <label className="form-label">Monto</label>
                <input
                  type="number"
                  name="monto"
                  className="form-control"
                  value={formData.monto}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 d-flex justify-content-center gap-3 mt-3">
                <button type="submit" className="btn btn-primary">
                  Registrar Transacción
                </button>
                <label className="btn btn-secondary mb-0">
                  Subir XML
                  <input
                    type="file"
                    accept=".xml"
                    onChange={handleXMLChange}
                    style={{ display: "none" }}
                  />
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
    </div>
  );
};

export default RegistrarTransaccion;
