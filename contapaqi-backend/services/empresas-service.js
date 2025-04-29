const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002;

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
    console.log('Servicio de Empresas conectado a MySQL');
});

// Rutas para Empresas
app.get('/', (req, res) => {
    db.query('SELECT * FROM empresas', (err, results) => {
        if (err) {
            console.error('Error al obtener empresas:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.post('/', (req, res) => {
    const { nombre, rfc, direccion, telefono, email, usuario_id } = req.body;

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

app.listen(PORT, () => {
    console.log(`Servicio de Empresas ejecutándose en http://localhost:${PORT}`);
});