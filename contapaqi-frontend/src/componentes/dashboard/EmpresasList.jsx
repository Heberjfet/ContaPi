import React from "react";
import { useNavigate } from "react-router-dom";

const EmpresasList = ({ empresas }) => {
  const navigate = useNavigate();

  const handleEmpresaClick = (empresa) => {
    navigate("/registrartransaccion", {
      state: { nombreEmpresa: empresa.nombre, empresaId: empresa.id },
    });
  };

  return (
    <div className="list-group">
      {empresas.map((empresa) => (
        <button
          key={empresa.id}
          className="list-group-item list-group-item-action"
          onClick={() => handleEmpresaClick(empresa)}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-1">{empresa.nombre}</h5>
            <small className="text-muted">{empresa.rfc}</small>
          </div>
          <p className="mb-1 text-muted">{empresa.direccion}</p>
        </button>
      ))}
    </div>
  );
};

export default EmpresasList;
