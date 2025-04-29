// services/cuentasMadreService.js
const { createService } = require('../gateway');
const { app: cuentasMadreApp, db: cuentasMadreDb } = createService(3003, 'Cuentas Madre');

// Rutas Cuentas Madre
cuentasMadreApp.get('/cuentas-madre', (req, res) => {
  cuentasMadreDb.query('SELECT * FROM cuentas_madre', (err, results) => {
    if (err) {
      console.error('Error al obtener cuentas madre:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

cuentasMadreApp.post('/cuentas-madre', (req, res) => {
  const { nombre, empresa_id } = req.body;
  cuentasMadreDb.query(
    'INSERT INTO cuentas_madre (nombre, empresa_id) VALUES (?, ?)',
    [nombre, empresa_id],
    (err, results) => {
      if (err) {
        console.error('Error al agregar cuenta madre:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.json({ id: results.insertId, nombre, empresa_id });
    }
  );
});
