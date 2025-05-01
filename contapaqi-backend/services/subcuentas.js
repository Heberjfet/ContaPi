// services/subcuentasService.js
const { createService } = require('../gateway');
const { app: subcuentasApp, db: subcuentasDb } = createService(3004, 'Subcuentas');

// POST /subcuentas: crear nueva subcuenta
subcuentasApp.post('/subcuentas', (req, res) => {
  const { nombre, cuenta_madre_id, empresa_id } = req.body;
  if (!nombre || !cuenta_madre_id || !empresa_id) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse.' });
  }

  const sql = `
    INSERT INTO subcuentas (nombre, cuenta_madre_id, empresa_id)
    VALUES (?, ?, ?)
  `;
  subcuentasDb.query(sql, [nombre, cuenta_madre_id, empresa_id], (err, results) => {
    if (err) {
      console.error('Error guardando subcuenta:', err);
      return res.status(500).json({ error: 'Error interno al guardar la subcuenta.' });
    }
    res.status(201).json({ message: 'Subcuenta registrada exitosamente.', id: results.insertId });
  });
});

// GET /subcuentas?empresa_id=ID: obtener todas las subcuentas de una empresa
subcuentasApp.get('/subcuentas', (req, res) => {
  const empresaId = req.query.empresa_id;
  if (!empresaId) {
    return res.status(400).json({ error: 'El parámetro empresa_id es requerido.' });
  }

  const sql = `
    SELECT id, nombre, cuenta_madre_id, empresa_id
    FROM subcuentas
    WHERE empresa_id = ?
  `;
  subcuentasDb.query(sql, [empresaId], (err, results) => {
    if (err) {
      console.error('Error obteniendo subcuentas:', err);
      return res.status(500).json({ error: 'Error interno al obtener las subcuentas.' });
    }
    res.json(results);
  });
});

module.exports = subcuentasApp;