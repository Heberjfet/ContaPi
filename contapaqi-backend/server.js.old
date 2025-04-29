const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root-contapi', // Cambia esto por tu usuario de MySQL
    password: 'Contapi12@', // Cambia esto por tu contraseña de MySQL
    database: 'contapi'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Rutas para Usuarios
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.post('/usuarios', (req, res) => {
    const { nombre, email, password } = req.body;
    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, password], (err, results) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json({ id: results.insertId, nombre, email });
    });
});

// Endpoint para el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    db.query(
        'SELECT * FROM usuarios WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error('Error al buscar usuario:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (results.length === 0) {
                // No se encontró ningún usuario con esas credenciales
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            // Usuario encontrado, devolver el objeto completo
            const usuario = results[0];
            res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
        }
    );
});

// Rutas para Empresas
app.get('/empresas', (req, res) => {
    db.query('SELECT * FROM empresas', (err, results) => {
        if (err) {
            console.error('Error al obtener empresas:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.post('/empresas', (req, res) => {
    const { nombre, rfc, direccion, telefono, email, usuario_id } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !rfc || !direccion || !telefono || !email || !usuario_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    db.query(
        'INSERT INTO empresas (nombre, rfc, direccion, telefono, email, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, rfc, direccion, telefono, email, usuario_id],
        (err, results) => {
            if (err) {
                console.error('Error al agregar empresa:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            res.json({ id: results.insertId, nombre, rfc, direccion, telefono, email, usuario_id });
        }
    );
});

// Rutas para Cuentas Madre
app.get('/cuentas-madre', (req, res) => {
    db.query('SELECT * FROM cuentas_madre', (err, results) => {
        if (err) {
            console.error('Error al obtener cuentas madre:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.post('/cuentas-madre', (req, res) => {
    const { nombre, empresa_id } = req.body;
    db.query('INSERT INTO cuentas_madre (nombre, empresa_id) VALUES (?, ?)', [nombre, empresa_id], (err, results) => {
        if (err) {
            console.error('Error al agregar cuenta madre:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json({ id: results.insertId, nombre, empresa_id });
    });
});

// Rutas para Subcuentas
app.get('/subcuentas', (req, res) => {
    db.query('SELECT * FROM subcuentas', (err, results) => {
        if (err) {
            console.error('Error al obtener subcuentas:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.post('/subcuentas', (req, res) => {
    const { nombre, cuenta_madre_id } = req.body;
    db.query('INSERT INTO subcuentas (nombre, cuenta_madre_id) VALUES (?, ?)', [nombre, cuenta_madre_id], (err, results) => {
        if (err) {
            console.error('Error al agregar subcuenta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json({ id: results.insertId, nombre, cuenta_madre_id });
    });
});

app.listen(port, () => {
    console.log('Servidor backend corriendo en http://localhost:${port}');
});