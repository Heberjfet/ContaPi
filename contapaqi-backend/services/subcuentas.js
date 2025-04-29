// services/subcuentasService.js
const { createService } = require('../gateway');
const { app: subcuentasApp, db: subcuentasDb } = createService(3004, 'Subcuentas');

// Endpoint para guardar una subcuenta
subcuentasApp.post('/subcuentas', (req, res) => {
  const { nombre, cuenta_madre_id, empresa_id } = req.body;

  if (!nombre || !cuenta_madre_id || !empresa_id) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados.' });
  }

  const query = `
    INSERT INTO subcuentas (nombre, cuenta_madre_id, empresa_id)
    VALUES (?, ?, ?)
  `;
  subcuentasDb.query(query, [nombre, cuenta_madre_id, empresa_id], (err, results) => {
    if (err) {
      console.error('Error al guardar la subcuenta:', err);
      return res.status(500).json({ error: 'Error al guardar la subcuenta.' });
    }
    res.status(201).json({ message: 'Subcuenta registrada exitosamente.', id: results.insertId });
  });
});

module.exports = subcuentasApp;
