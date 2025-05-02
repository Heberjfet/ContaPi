// gateway.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configuración de la conexión a MySQL
const dbConfig = {
  host: 'localhost',          // Dirección del servidor MySQL
  user: 'root-contapi',       // Usuario de la base de datos
  password: 'Contapi12@',     // Contraseña del usuario
  database: 'contapi',        // Nombre de la nueva base de datos
};

// Función genérica para levantar un microservicio
function createService(port, name) {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Conexión a la BD
  const db = mysql.createConnection(dbConfig);
  db.connect(err => {
    if (err) {
      console.error(`Error conectando a la BD (${name}):`, err);
      return;
    }
    console.log(`Servicio de ${name} conectado a MySQL`);
  });

  // Arranca el servidor
  app.listen(port, () => {
    console.log(`Servicio de ${name} corriendo en http://localhost:${port}`);
  });

  return { app, db };
}

// Exportamos la función para los servicios
module.exports = { createService };

// Punto de entrada: arrancar todos los microservicios
console.log('Iniciando todos los microservicios...');
require('./services/usuarios');
require('./services/empresas');
require('./services/cuentasmadre');
require('./services/subcuentas');
require('./services/transacciones'); // Nuevo microservicio para transacciones
require('./services/ollama'); // Nuevo microservicio para Ollama
require('./services/descarga_masiva'); // Nuevo microservicio para descarga masiva
