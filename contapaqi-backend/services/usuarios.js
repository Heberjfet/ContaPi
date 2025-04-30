// services/usuariosService.js
const { createService } = require('../gateway');
const { app: usuariosApp, db: usuariosDb } = createService(3001, 'Usuarios');

// Rutas Usuarios
usuariosApp.get('/usuarios', (req, res) => {
  usuariosDb.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

usuariosApp.post('/usuarios', (req, res) => {
  const { nombre, email, password } = req.body;
  usuariosDb.query(
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
});

usuariosApp.post('/login', (req, res) => {
  const { email, password } = req.body;
  usuariosDb.query(
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
