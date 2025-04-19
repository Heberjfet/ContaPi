import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function EmpresasList({ empresas, handleFavorito }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        {empresas.length > 0 ? (
          empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="d-flex justify-content-between align-items-center p-3 border-bottom"
            >
              <div>
                <h5 className="mb-1">{empresa.nombre}</h5>
                <small className="text-muted">{empresa.tipo}</small>
              </div>
              <button
                className="btn btn-link text-decoration-none"
                onClick={() => handleFavorito(empresa.id)}
                aria-label={
                  empresa.favorita
                    ? "Quitar de favoritos"
                    : "Añadir a favoritos"
                }
              >
                {empresa.favorita ? (
                  <FaHeart color="red" size={20} />
                ) : (
                  <FaRegHeart size={20} />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="p-3 text-center text-muted">
            No hay empresas para mostrar
          </div>
        )}
      </div>
    </div>
  );
}

export default EmpresasList;
