const { createService: createTR } = require('../gateway');
createTR(3005, 'Transacciones').then(({ app, dbs }) => {
  const { mongoDb, breaker } = dbs;

  // Crear transacción
  app.post('/transacciones', async (req, res) => {
    const { fecha, descripcion, monto, empresa_id, cuenta_madre_id, subcuenta_id } = req.body;
    if (!fecha || !descripcion || !monto || !empresa_id || !cuenta_madre_id) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse.' });
    }

    try {
      const [result] = await breaker.fire(
        `INSERT INTO transacciones (fecha, descripcion, monto, empresa_id, cuenta_madre_id, subcuenta_id) VALUES (?,?,?,?,?,?)`,
        [fecha, descripcion, monto, empresa_id, cuenta_madre_id, subcuenta_id || null]
      );
      const newId = result.insertId;
      await mongoDb.collection('transacciones').insertOne({ mysql_id: newId, fecha: new Date(fecha), descripcion, monto, empresa_id, cuenta_madre_id, subcuenta_id: subcuenta_id || null });
      return res.status(201).json({ id: newId, message: 'Transacción registrada exitosamente.' });
    } catch {
      const { insertedId } = await mongoDb.collection('transacciones').insertOne({ fecha: new Date(fecha), descripcion, monto, empresa_id, cuenta_madre_id, subcuenta_id: subcuenta_id || null, fallback: true });
      return res.status(201).json({ fallback: true, mongoId: insertedId, message: 'Transacción registrada en fallback.' });
    }
  });
});