const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const CircuitBreaker = require('opossum');
const { exec } = require('child_process');
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root-contapi',
  password: 'Contapi12@',
  database: 'contapi',
};

async function createService(port, name) {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const mysqlPool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const breaker = new CircuitBreaker(
    (sql, params) => mysqlPool.query(sql, params),
    { timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 30000 }
  );
  breaker.fallback(() => { throw new Error('MySQL no disponible'); });

  const mongoClient = new MongoClient(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017');
  await mongoClient.connect();
  const mongoDb = mongoClient.db('contapi');

  app.locals.dbs = { mysqlPool, mongoDb, breaker };
  app.listen(port, () => console.log(`${name} corriendo en http://localhost:${port}`));

  return { app, dbs: app.locals.dbs };
}

module.exports = { createService };

if (require.main === module) {
  const servicios = [
    'usuarios',
    'empresas',
    'cuentasmadre',
    'subcuentas',
    'transacciones',
    'descarga_masiva',
    'ollama'
  ];

  const comandoTerminal = process.platform === 'win32'
    ? 'start cmd /k'
    : process.platform === 'darwin'
      ? 'osascript -e'
      : 'gnome-terminal -- bash -c';

  servicios.forEach(servicio => {
    const ruta = path.join(__dirname, 'services', `${servicio}.js`);
    let comando;

    if (process.platform === 'win32') {
      comando = `${comandoTerminal} "node ${ruta}"`;
    } else if (process.platform === 'darwin') {
      comando = `${comandoTerminal} 'tell app "Terminal" to do script "node ${ruta}"'`;
    } else {
      comando = `${comandoTerminal} "node ${ruta}; exec bash"`;
    }

    exec(comando, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error al iniciar ${servicio}:`, error.message);
      }
    });
  });
}
