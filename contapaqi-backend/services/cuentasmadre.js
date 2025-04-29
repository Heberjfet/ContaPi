// services/cuentasMadreService.js
const { createService } = require('../gateway');
const { app: cuentasMadreApp, db: cuentasMadreDb } = createService(3003, 'Cuentas Madre');

// Rutas Cuentas Madre

// Obtener todas las cuentas madre
cuentasMadreApp.get('/cuentas-madre', (req, res) => {
  cuentasMadreDb.query('SELECT * FROM cuentas_madre', (err, results) => {
    if (err) {
      console.error('Error al obtener cuentas madre:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

// Agregar una nueva cuenta madre
cuentasMadreApp.post('/cuentas-madre', (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la cuenta madre es obligatorio.' });
  }

  cuentasMadreDb.query(
    'INSERT INTO cuentas_madre (nombre) VALUES (?)',
    [nombre],
    (err, results) => {
      if (err) {
        console.error('Error al agregar cuenta madre:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.json({ id: results.insertId, nombre });
    }
  );
});

// Eliminar una cuenta madre (opcional, si necesitas esta funcionalidad)
cuentasMadreApp.delete('/cuentas-madre/:id', (req, res) => {
  const { id } = req.params;

  cuentasMadreDb.query('DELETE FROM cuentas_madre WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar cuenta madre:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Cuenta madre no encontrada.' });
    }
    res.json({ message: 'Cuenta madre eliminada correctamente.' });
  });
});

module.exports = cuentasMadreApp;
