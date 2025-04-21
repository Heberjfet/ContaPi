import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Recuperacion from "./componentes/Autenticacion/Recuperacion";
import Register from "./componentes/Autenticacion/Register";
import LoginForm from "./componentes/Autenticacion/LoginForm";
import Homepage from "./componentes/dashboard/Homepage";
import AgregarEmpresa from "./componentes/empresa/AgregarEmpresa";
import RegistrarTransaccion from "./componentes/empresa/registrartransaccion";
import DescargaMasivas from "./componentes/empresa/DescargaMasivas";
import Ajustes from "./componentes/dashboard/Ajustes"; // Ajusta la ruta según tu estructura

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Recuperacion" element={<Recuperacion />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/agregar-empresa" element={<AgregarEmpresa />} />
        <Route
          path="/registrartransaccion"
          element={<RegistrarTransaccion />}
        />
        <Route path="/descarga-masiva" element={<DescargaMasivas />} />
        <Route path="/Ajustes" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
