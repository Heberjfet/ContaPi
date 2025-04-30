// services/usuariosService.js
const { createService } = require('../gateway');
const { app: usuariosApp, db: usuariosDb } = createService(3001, 'Usuarios');

// Rutas Usuarios
usuariosApp.get('/usuarios', (req, res) => {
  usuariosDb.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

// Ruta para obtener un usuario específico por ID
usuariosApp.get('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
  
  usuariosDb.query(
    'SELECT * FROM usuarios WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error al obtener usuario por ID:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      // Enviamos los datos del usuario sin la contraseña
      const usuario = results[0];
      const { password, ...usuarioSinPassword } = usuario;
      
      res.json(usuarioSinPassword);
    }
  );
});

usuariosApp.post('/usuarios', (req, res) => {
  const { nombre, email, password } = req.body;
  usuariosDb.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, password],
    (err, results) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.json({ id: results.insertId, nombre, email });
    }
  );
});

usuariosApp.post('/login', (req, res) => {
  const { email, password } = req.body;
  usuariosDb.query(
    'SELECT * FROM usuarios WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
      const usuario = results[0];
      res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
    }
  );
});

// Actualizar información del usuario
usuariosApp.put('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
  const { nombre, email, password } = req.body;
  
  // Construir la consulta dinámicamente según los campos proporcionados
  let query = 'UPDATE usuarios SET ';
  const updateFields = [];
  const values = [];
  
  if (nombre) {
    updateFields.push('nombre = ?');
    values.push(nombre);
  }
  
  if (email) {
    updateFields.push('email = ?');
    values.push(email);
  }
  
  if (password) {
    updateFields.push('password = ?');
    values.push(password);
  }
  
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
  }
  
  query += updateFields.join(', ') + ' WHERE id = ?';
  values.push(userId);
  
  usuariosDb.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Obtener los datos actualizados del usuario
    usuariosDb.query(
      'SELECT id, nombre, email FROM usuarios WHERE id = ?',
      [userId], 
      (err, results) => {
        if (err) {
          console.error('Error al obtener usuario actualizado:', err);
          return res.status(200).json({ message: 'Usuario actualizado correctamente' });
        }
        
        res.json(results[0]);
      }
    );
  });
});