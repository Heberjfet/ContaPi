const { createService: createEmp } = require('../gateway');
createEmp(3002, 'Empresas').then(({ app, dbs }) => {
  const { mongoDb, breaker } = dbs;

  app.get('/empresas', async (req, res) => {
    try {
      const [rows] = await breaker.fire('SELECT * FROM empresas', []);
      res.json(rows);
    } catch {
      res.json(await mongoDb.collection('empresas').find().toArray());
    }
  });

  app.post('/empresas', async (req, res) => {
    const { nombre, rfc, direccion, telefono, email, usuario_id } = req.body;
    if (!nombre || !rfc || !direccion || !telefono || !email || !usuario_id)
      return res.status(400).json({ error: 'Faltan campos obligatorios' });

    try {
      const [result] = await breaker.fire(
        'INSERT INTO empresas (nombre, rfc, direccion, telefono, email, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, rfc, direccion, telefono, email, usuario_id]
      );
      const newId = result.insertId;
      await mongoDb.collection('empresas').insertOne({ mysql_id: newId, nombre, rfc, direccion, telefono, email, usuario_id });
      res.status(201).json({ id: newId, nombre, rfc, direccion, telefono, email, usuario_id });
    } catch {
      const { insertedId } = await mongoDb.collection('empresas').insertOne({ nombre, rfc, direccion, telefono, email, usuario_id, fallback: true });
      res.status(201).json({ fallback: true, mongoId: insertedId, nombre, rfc, direccion, telefono, email, usuario_id });
    }
  });
});