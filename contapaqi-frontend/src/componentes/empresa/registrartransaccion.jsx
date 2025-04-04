import { useState } from "react";
import { useLocation } from "react-router-dom";

const RegistrarTransaccion = () => {
    const location = useLocation();
    const nombreEmpresa = location.state?.nombreEmpresa || "Empresa no especificada";

    const [formData, setFormData] = useState({
        fecha: "",
        descripcion: "",
        cuenta: "",
        subcuenta: "",
        monto: "",
    });

    const [transacciones, setTransacciones] = useState([]);
    const [archivoXML, setArchivoXML] = useState(null);

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
        <div className="container">
            {/* Aquí se muestra el nombre de la empresa */}
            <h2>{nombreEmpresa}</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
                <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} required />
                <input type="text" name="cuenta" placeholder="Cuenta" value={formData.cuenta} onChange={handleChange} required />
                <input type="text" name="subcuenta" placeholder="Subcuenta (Opcional)" value={formData.subcuenta} onChange={handleChange} />
                <input type="number" name="monto" placeholder="Monto" value={formData.monto} onChange={handleChange} required />

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                    <button type="submit" className="btn btn-primary">Registrar Transacción</button>

                    <label className="btn btn-secondary mb-0">
                        Subir XML
                        <input type="file" accept=".xml" onChange={handleXMLChange} style={{ display: 'none' }} />
                    </label>
                </div>
            </form>

            <h3>Libro Diario</h3>
            <table className="table">
                <thead>
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
                            <td>{transaccion.monto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RegistrarTransaccion;
