const { createService } = require('../gateway');
const { app: transaccionesApp, db: transaccionesDb } = createService(3005, 'Transacciones');

// Endpoint para guardar una transacción
transaccionesApp.post('/transacciones', (req, res) => {
  const { fecha, descripcion, monto, empresa_id, cuenta_madre_id, subcuenta_id } = req.body;

  // Validar que los campos obligatorios estén presentes
  if (!fecha || !descripcion || !monto || !empresa_id || !cuenta_madre_id) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados.' });
  }

  // Consulta para insertar la transacción
  const query = `
    INSERT INTO transacciones (fecha, descripcion, monto, empresa_id, cuenta_madre_id, subcuenta_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  transaccionesDb.query(
    query,
    [fecha, descripcion, monto, empresa_id, cuenta_madre_id, subcuenta_id || null],
    (err, results) => {
      if (err) {
        console.error('Error al guardar la transacción:', err);
        return res.status(500).json({ error: 'Error al guardar la transacción.' });
      }
      res.status(201).json({ message: 'Transacción registrada exitosamente.', id: results.insertId });
    }
  );
});

module.exports = transaccionesApp;