const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
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
    console.log('Servicio de Cuentas conectado a MySQL');
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

app.listen(PORT, () => {
    console.log(`Servicio de Cuentas ejecutándose en http://localhost:${PORT}`);
});