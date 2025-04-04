import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componentes/Autenticacion/Login';
import Register from './componentes/Autenticacion/Register';
import LoginForm from './componentes/Autenticacion/LoginForm';
import Homepage from './componentes/dashboard/Homepage';
import AgregarEmpresa from './componentes/empresa/AgregarEmpresa';
import RegistrarTransaccion from './componentes/empresa/registrartransaccion';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<Register />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/agregar-empresa" element={<AgregarEmpresa />} />
                <Route path="/registrartransaccion" element={<RegistrarTransaccion />} />
            </Routes>
        </Router>
    );
}

export default App;