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
  // *** Estado para almacenar TODAS las subcuentas de la empresa ***
  const [todasSubcuentas, setTodasSubcuentas] = useState([]);
  const [loadingSubcuentas, setLoadingSubcuentas] = useState(false); // Opcional: para indicar carga

  // Efecto para obtener la fecha actual (sin cambios)
  useEffect(() => {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setFechaActual(fechaFormateada);
  }, []);

  // Efecto para cargar las cuentas madre (depende de empresaId)
  useEffect(() => {
    const fetchCuentasMadre = async () => {
      if (!empresaId) return;
      try {
        // Ajusta el endpoint si es necesario
        const response = await fetch(
          `http://localhost:3003/cuentas-madre?empresa_id=${empresaId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener las cuentas madre");
        }
        const data = await response.json();
        setCuentasMadre(data);
      } catch (error) {
        console.error("Error al cargar cuentas madre:", error);
        alert("Hubo un problema al cargar las cuentas madre.");
      }
    };

    fetchCuentasMadre();
  }, [empresaId]);

  // *** NUEVO EFECTO: Cargar TODAS las subcuentas de la empresa ***
  useEffect(() => {
    const fetchTodasSubcuentas = async () => {
      if (!empresaId) {
        setTodasSubcuentas([]); // Limpiar si no hay empresaId
        return;
      }

      setLoadingSubcuentas(true); // Iniciar carga (opcional)
      try {
        // --- ¡IMPORTANTE! ---
        // Necesitas un endpoint que devuelva TODAS las subcuentas para la empresaId.
        // Ejemplo: /subcuentas?empresa_id={empresaId}
        const response = await fetch(
          `http://localhost:3004/subcuentas?empresa_id=${empresaId}` // <-- AJUSTA ESTE ENDPOINT
        );
        if (!response.ok) {
          throw new Error(`Error al obtener todas las subcuentas`);
        }
        const data = await response.json();
        setTodasSubcuentas(data);
      } catch (error) {
        console.error("Error al cargar todas las subcuentas:", error);
        setTodasSubcuentas([]); // Limpiar en caso de error
        alert("Hubo un problema al cargar la lista de subcuentas.");
      } finally {
        setLoadingSubcuentas(false); // Finalizar carga (opcional)
      }
    };

    fetchTodasSubcuentas();
  }, [empresaId]); // Depende solo de empresaId

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // handleChange simple, ya no resetea subcuenta al cambiar cuenta
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
       ...prevFormData,
       [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fecha ||
      !formData.descripcion ||
      !formData.cuenta ||
      !formData.monto
    ) {
      alert(
        "Los campos Fecha, Descripción, Cuenta Madre y Monto son obligatorios."
      );
      return;
    }

    const nuevaTransaccion = {
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      monto: parseFloat(formData.monto),
      empresa_id: empresaId,
      cuenta_madre_id: formData.cuenta,
      subcuenta_id: formData.subcuenta || null, // Sigue siendo el ID o null
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
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al guardar la transacción"
        );
      }

      const data = await response.json();
      alert(data.message || "Transacción registrada con éxito");

      // --- Ajuste para mostrar nombres en la tabla local ---
      const cuentaMadreSeleccionada = cuentasMadre.find(
        (cm) => cm.id.toString() === formData.cuenta.toString()
      );
      // *** Buscar en TODAS las subcuentas ***
      const subcuentaSeleccionada = todasSubcuentas.find(
        (sc) => sc.id.toString() === formData.subcuenta.toString()
      );

      const transaccionParaMostrar = {
        ...nuevaTransaccion,
        id: data.id,
        cuentaNombre: cuentaMadreSeleccionada
          ? cuentaMadreSeleccionada.nombre
          : "ID: " + formData.cuenta,
        subcuentaNombre: subcuentaSeleccionada
          ? subcuentaSeleccionada.nombre
          : formData.subcuenta
          ? "ID: " + formData.subcuenta
          : "-",
      };
      // --- Fin del ajuste ---

      setTransacciones((prev) => [...prev, transaccionParaMostrar]);
      setFormData({ // Resetear formulario
        fecha: "",
        descripcion: "",
        cuenta: "",
        subcuenta: "",
        monto: "",
      });
      // No necesitamos resetear todasSubcuentas aquí
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      alert(`Hubo un problema al guardar la transacción: ${error.message}`);
    }
  };

  const handleXMLChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.name.endsWith(".xml")) {
      setArchivoXML(archivo);
      alert(`Archivo seleccionado: ${archivo.name}`);
    } else {
      alert("Por favor selecciona un archivo XML válido.");
      e.target.value = null;
    }
  };

  // --- Renderizado (JSX) ---
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
              {/* Fecha */}
              <div className="col-md-2">
                <label htmlFor="fecha" className="form-label">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  className="form-control"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Descripción */}
              <div className="col-md-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Cuenta Madre */}
              <div className="col-md-3">
                <label htmlFor="cuenta" className="form-label">Cuenta Madre</label>
                <select
                  id="cuenta"
                  name="cuenta"
                  className="form-select"
                  value={formData.cuenta}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Selecciona una cuenta madre</option>
                  {cuentasMadre.map((cuenta) => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {/* Subcuenta (Select con TODAS las subcuentas) */}
              <div className="col-md-3">
                <label htmlFor="subcuenta" className="form-label">Subcuenta</label>
                <select
                  id="subcuenta"
                  name="subcuenta"
                  className="form-select"
                  value={formData.subcuenta}
                  onChange={handleChange}
                  disabled={loadingSubcuentas} // Deshabilitado mientras carga (opcional)
                >
                  <option value="">
                    {loadingSubcuentas ? 'Cargando...' : (todasSubcuentas.length > 0 ? 'Selecciona una subcuenta (Opcional)' : 'No hay subcuentas disponibles')}
                  </option>
                  {/* *** Mapear sobre TODAS las subcuentas *** */}
                  {todasSubcuentas.map((subcuenta) => (
                    <option key={subcuenta.id} value={subcuenta.id}>
                      {subcuenta.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {/* Monto */}
              <div className="col-md-2">
                <label htmlFor="monto" className="form-label">Monto</label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  className="form-control"
                  step="0.01"
                  value={formData.monto}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Botones */}
              <div className="col-12 d-flex justify-content-center gap-3 mt-4">
                <button type="submit" className="btn btn-primary px-4">
                  Registrar Transacción
                </button>
                <label className="btn btn-secondary mb-0 px-4">
                  Subir XML
                  <input
                    type="file"
                    accept=".xml"
                    onChange={handleXMLChange}
                    style={{ display: "none" }}
                    onClick={(event) => { event.target.value = null }}
                  />
                </label>
              </div>
            </form>
          </div>

          {/* Tabla de Libro Diario */}
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3 text-center">Libro Diario</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle text-center">
                <thead className="table-dark">
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
                    <tr key={transaccion.id || index}>
                      <td>{new Date(transaccion.fecha + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                      <td>{transaccion.descripcion}</td>
                      <td>{transaccion.cuentaNombre}</td>
                      <td>{transaccion.subcuentaNombre}</td>
                      <td>${parseFloat(transaccion.monto).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  {transacciones.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted fst-italic py-3">
                        No hay transacciones registradas para mostrar.
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