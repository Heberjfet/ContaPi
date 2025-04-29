const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001; // Puerto para el servicio de usuarios

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root-contapi', // Ajusta esto según tu configuración
    password: 'Contapi12@', // Ajusta esto según tu configuración
    database: 'contapi'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Servicio de Usuarios conectado a la base de datos MySQL');
});

// Ruta para obtener todos los usuarios
app.get('/', (req, res) => {
    db.query('SELECT id, nombre, email FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

// Ruta para registrar un nuevo usuario
app.post('/', (req, res) => {
    const { nombre, email, password } = req.body;
    
    // Verificar si el correo ya está registrado
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error al verificar email:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ error: 'Este correo electrónico ya está registrado' });
        }
        
        // Hashear la contraseña antes de guardarla
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error al hashear la contraseña:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            
            db.query(
                'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', 
                [nombre, email, hashedPassword], 
                (err, results) => {
                    if (err) {
                        console.error('Error al registrar usuario:', err);
                        return res.status(500).json({ error: 'Error en el servidor' });
                    }
                    res.status(201).json({ 
                        id: results.insertId, 
                        nombre, 
                        email 
                    });
                }
            );
        });
    });
});

// Endpoint para el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        (err, results) => {
            if (err) {
                console.error('Error al buscar usuario:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (results.length === 0) {
                // No se encontró ningún usuario con ese correo
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            // Usuario encontrado, verificar contraseña
            const usuario = results[0];
            
            bcrypt.compare(password, usuario.password, (err, match) => {
                if (err) {
                    console.error('Error al comparar contraseñas:', err);
                    return res.status(500).json({ error: 'Error en el servidor' });
                }
                
                if (!match) {
                    return res.status(401).json({ error: 'Credenciales incorrectas' });
                }
                
                // Contraseña correcta, devolver información del usuario (sin la contraseña)
                res.json({ 
                    id: usuario.id, 
                    nombre: usuario.nombre, 
                    email: usuario.email 
                });
            });
        }
    );
});

// Endpoint para recuperación de contraseña
app.post('/recuperar-password', (req, res) => {
    const { email } = req.body;
    
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'No existe una cuenta con ese correo electrónico' });
        }
        
        // Aquí normalmente enviarías un email con un token o link para restablecer contraseña
        // Por simplicidad, solo devolvemos un mensaje de éxito
        res.json({ message: 'Se ha enviado un enlace a tu correo para recuperar tu contraseña' });
    });
});

app.listen(port, () => {
    console.log(`Servicio de Usuarios corriendo en http://localhost:${port}`);
});
