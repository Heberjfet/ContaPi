const { createService } = require('../gateway');
createService(3003, 'Cuentas Madre').then(({ app, dbs }) => {
  const { mongoDb, breaker } = dbs;

  // Obtener todas las cuentas madre
  app.get('/cuentas-madre', async (req, res) => {
    try {
      const [rows] = await breaker.fire('SELECT * FROM cuentas_madre', []);
      return res.json(rows);
    } catch {
      const docs = await mongoDb.collection('cuentas_madre').find().toArray();
      return res.json(docs);
    }
  });

  // Agregar nueva cuenta madre
  app.post('/cuentas-madre', async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio.' });

    try {
      const [result] = await breaker.fire(
        'INSERT INTO cuentas_madre (nombre) VALUES (?)',
        [nombre]
      );
      const newId = result.insertId;
      await mongoDb.collection('cuentas_madre').insertOne({ mysql_id: newId, nombre });
      return res.json({ id: newId, nombre });
    } catch {
      const { insertedId } = await mongoDb.collection('cuentas_madre').insertOne({ nombre, fallback: true });
      return res.status(201).json({ fallback: true, mongoId: insertedId, nombre });
    }
  });

  // Eliminar cuenta madre
  app.delete('/cuentas-madre/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
      const [result] = await breaker.fire('DELETE FROM cuentas_madre WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cuenta madre no encontrada.' });
      }
      await mongoDb.collection('cuentas_madre').deleteOne({ mysql_id: id });
      return res.json({ message: 'Cuenta madre eliminada correctamente.' });
    } catch {
      return res.status(500).json({ error: 'Error al eliminar cuenta madre.' });
    }
  });
});