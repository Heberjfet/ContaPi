const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
<<<<<<< HEAD
const cors = require('cors');

const app = express();
const port = 3001;
=======

const app = express();
const PORT = 3001;
>>>>>>> parent of 8276cfc (se cambiaros algunas rutas del api pára revisar el funcionamiento)

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
<<<<<<< HEAD
  host: 'localhost',
  user: 'root-contapi',
  password: 'Contapi12@',
  database: 'contapi',
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Servicio de Usuarios conectado a la base de datos MySQL');
=======
    host: 'localhost',
    user: 'root-contapi',
    password: 'Contapi12@',
    database: 'contapi'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Servicio de Usuarios conectado a MySQL');
>>>>>>> parent of 8276cfc (se cambiaros algunas rutas del api pára revisar el funcionamiento)
});

// Rutas para Usuarios
app.get('/', (req, res) => {
<<<<<<< HEAD
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

app.post('/', (req, res) => {
  const { nombre, email, password } = req.body;
  db.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, password],
    (err, results) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.json({ id: results.insertId, nombre, email });
    }
  );
=======
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.post('/', (req, res) => {
    const { nombre, email, password } = req.body;
    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, password], (err, results) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json({ id: results.insertId, nombre, email });
    });
>>>>>>> parent of 8276cfc (se cambiaros algunas rutas del api pára revisar el funcionamiento)
});

app.post('/login', (req, res) => {
<<<<<<< HEAD
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM usuarios WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
      const usuario = results[0];
      res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
    }
  );
});

app.listen(port, () => {
  console.log(`Servicio de Usuarios corriendo en http://localhost:${port}`);
=======
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM usuarios WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error('Error al buscar usuario:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            const usuario = results[0];
            res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Servicio de Usuarios ejecutándose en http://localhost:${PORT}`);
>>>>>>> parent of 8276cfc (se cambiaros algunas rutas del api pára revisar el funcionamiento)
});
