// services/empresasService.js
const { createService } = require('../gateway');
const { app: empresasApp, db: empresasDb } = createService(3002, 'Empresas');

// Rutas Empresas
empresasApp.get('/empresas', (req, res) => {
  empresasDb.query('SELECT * FROM empresas', (err, results) => {
    if (err) {
      console.error('Error al obtener empresas:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

empresasApp.post('/empresas', (req, res) => {
  const { nombre, rfc, direccion, telefono, email, usuario_id } = req.body;
  if (!nombre || !rfc || !direccion || !telefono || !email || !usuario_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  empresasDb.query(
    'INSERT INTO empresas (nombre, rfc, direccion, telefono, email, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, rfc, direccion, telefono, email, usuario_id],
    (err, results) => {
      if (err) {
        console.error('Error al agregar empresa:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.json({
        id: results.insertId,
        nombre,
        rfc,
        direccion,
        telefono,
        email,
        usuario_id
      });
    }
  );
});
