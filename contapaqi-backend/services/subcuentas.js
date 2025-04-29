// services/subcuentasService.js
const { createService } = require('../gateway');
const { app: subcuentasApp, db: subcuentasDb } = createService(3004, 'Subcuentas');

// Rutas Subcuentas
subcuentasApp.get('/subcuentas', (req, res) => {
  subcuentasDb.query('SELECT * FROM subcuentas', (err, results) => {
    if (err) {
      console.error('Error al obtener subcuentas:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

subcuentasApp.post('/subcuentas', (req, res) => {
  const { nombre, cuenta_madre_id } = req.body;
  subcuentasDb.query(
    'INSERT INTO subcuentas (nombre, cuenta_madre_id) VALUES (?, ?)',
    [nombre, cuenta_madre_id],
    (err, results) => {
      if (err) {
        console.error('Error al agregar subcuenta:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.json({ id: results.insertId, nombre, cuenta_madre_id });
    }
  );
});
