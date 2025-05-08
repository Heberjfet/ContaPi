const { createService: createSC } = require('../gateway');
createSC(3004, 'Subcuentas').then(({ app, dbs }) => {
  const { mongoDb, breaker } = dbs;

  // Obtener subcuentas por empresa
  app.get('/subcuentas', async (req, res) => {
    const empresaId = Number(req.query.empresa_id);
    if (!empresaId) return res.status(400).json({ error: 'El parámetro empresa_id es requerido.' });

    try {
      const [rows] = await breaker.fire(
        'SELECT id, nombre, cuenta_madre_id, empresa_id FROM subcuentas WHERE empresa_id = ?',
        [empresaId]
      );
      return res.json(rows);
    } catch {
      const docs = await mongoDb.collection('subcuentas').find({ empresa_id: empresaId }).toArray();
      return res.json(docs);
    }
  });

  // Crear nueva subcuenta
  app.post('/subcuentas', async (req, res) => {
    const { nombre, cuenta_madre_id, empresa_id } = req.body;
    if (!nombre || !cuenta_madre_id || !empresa_id) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse.' });
    }

    try {
      const [result] = await breaker.fire(
        'INSERT INTO subcuentas (nombre, cuenta_madre_id,empresa_id) VALUES (?,?,?)',
        [nombre, cuenta_madre_id, empresa_id]
      );
      const newId = result.insertId;
      await mongoDb.collection('subcuentas').insertOne({ mysql_id: newId, nombre, cuenta_madre_id, empresa_id });
      return res.status(201).json({ id: newId, nombre });
    } catch {
      const { insertedId } = await mongoDb.collection('subcuentas').insertOne({ nombre, cuenta_madre_id, empresa_id, fallback: true });
      return res.status(201).json({ fallback: true, mongoId: insertedId, nombre });
    }
  });
});