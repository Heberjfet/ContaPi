import React from "react";
import { FaBars } from "react-icons/fa";

function Navbar({ nombre, toggleSidebar }) {
  return (
    <nav
      className="navbar navbar-dark py-3"
      style={{ backgroundColor: "#160041" }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-white me-3"
            onClick={toggleSidebar}
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
  );
}

export default Navbar;
