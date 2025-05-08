const { createService } = require('../gateway');
createService(3001, 'Usuarios').then(({ app, dbs }) => {
  const { mongoDb, breaker } = dbs;

  app.get('/usuarios', async (req, res) => {
    try {
      const [rows] = await breaker.fire('SELECT id, nombre, email FROM usuarios', []);
      res.json(rows);
    } catch {
      res.json(await mongoDb.collection('usuarios').find().toArray());
    }
  });

  app.get('/usuarios/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
      const [rows] = await breaker.fire(
        'SELECT id, nombre, email FROM usuarios WHERE id = ?',
        [id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(rows[0]);
    } catch {
      const doc = await mongoDb.collection('usuarios').findOne({ mysql_id: id });
      if (!doc) return res.status(404).json({ error: 'Usuario no encontrado' });
      delete doc._id;
      res.json(doc);
    }
  });

  app.post('/usuarios', async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Faltan campos obligatorios' });

    try {
      const [result] = await breaker.fire(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, password]
      );
      const newId = result.insertId;
      await mongoDb.collection('usuarios').insertOne({ mysql_id: newId, nombre, email });
      res.status(201).json({ id: newId, nombre, email });
    } catch {
      const { insertedId } = await mongoDb
        .collection('usuarios')
        .insertOne({ nombre, email, fallback: true });
      res.status(201).json({ fallback: true, mongoId: insertedId, nombre, email });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const [rows] = await breaker.fire(
        'SELECT id, nombre, email FROM usuarios WHERE email = ? AND password = ?',
        [email, password]
      );
      if (!rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });
      res.json(rows[0]);
    } catch {
      const doc = await mongoDb.collection('usuarios').findOne({ email, password });
      if (!doc) return res.status(401).json({ error: 'Credenciales inválidas' });
      res.json({ id: doc.mysql_id || null, nombre: doc.nombre, email: doc.email });
    }
  });

  app.put('/usuarios/:id', async (req, res) => {
    const id = Number(req.params.id);
    const fields = [];
    const values = [];
    ['nombre', 'email', 'password'].forEach((key) => {
      if (req.body[key]) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    });
    if (!fields.length) return res.status(400).json({ error: 'Nada por actualizar' });
    values.push(id);
    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;

    try {
      const [result] = await breaker.fire(sql, values);
      if (result.affectedRows === 0)
        return res.status(404).json({ error: 'Usuario no encontrado' });
      await mongoDb.collection('usuarios').updateOne({ mysql_id: id }, { $set: req.body });
      res.json({ message: 'Usuario actualizado' });
    } catch {
      res.status(500).json({ error: 'Error actualizando usuario' });
    }
  });
});