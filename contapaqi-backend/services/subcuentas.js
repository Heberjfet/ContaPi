// services/subcuentasService.js
const { createService } = require('../gateway');
const { app: subcuentasApp, db: subcuentasDb } = createService(3004, 'Subcuentas');

// --- Endpoint EXISTENTE para guardar (POST) ---
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
      return res.status(500).json({ error: 'Error interno al guardar la subcuenta.' });
    }
    res.status(201).json({ message: 'Subcuenta registrada exitosamente.', id: results.insertId });
  });
});

// --- Endpoint NUEVO para obtener (GET) todas las subcuentas por empresa ---
subcuentasApp.get('/subcuentas', (req, res) => {
  // Obtener empresa_id de los query parameters (ej: /subcuentas?empresa_id=123)
  const empresaId = req.query.empresa_id;

  // Validar que se proporcionó empresa_id
  if (!empresaId) {
    return res.status(400).json({ error: 'El parámetro empresa_id es requerido.' });
  }

  // Consulta SQL para seleccionar las subcuentas de esa empresa
  const query = `
    SELECT id, nombre, cuenta_madre_id, empresa_id
    FROM subcuentas
    WHERE empresa_id = ?
  `;

  subcuentasDb.query(query, [empresaId], (err, results) => {
    if (err) {
      console.error('Error al obtener las subcuentas:', err);
      return res.status(500).json({ error: 'Error interno al obtener las subcuentas.' });
    }
    // Enviar la lista de subcuentas como respuesta JSON
    res.json(results); // results será un array de objetos subcuenta
  });
});
// --- Fin del endpoint NUEVO ---

module.exports = subcuentasApp;