const { createService } = require('../gateway');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { app: usuariosApp, db: usuariosDb } = createService(3001, 'Usuarios');

// Registrar nuevo usuario
usuariosApp.post('/usuarios', async (req, res) => {
  const { nombre, email, password } = req.body;
 
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  try {
    const hash = await bcrypt.hash(password, saltRounds);
   
    usuariosDb.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hash],
      (err, results) => {
        if (err) {
          console.error('Error al registrar usuario:', err);
          return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.status(201).json({
          id: results.insertId,
          nombre,
          email
        });
      }
    );
  } catch (error) {
    console.error('Error al hashear contraseña:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Iniciar sesión
usuariosApp.post('/login', (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }
  usuariosDb.query(
    'SELECT id, nombre, email, password FROM usuarios WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
     
      const usuario = results[0];
      try {
        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
       
        res.json({
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email
        });
      } catch (error) {
        console.error('Error al comparar contraseñas:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
    }
  );
});

// Obtener datos de usuario
usuariosApp.get('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
 
  usuariosDb.query(
    'SELECT id, nombre, email FROM usuarios WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error al obtener usuario:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(results[0]);
    }
  );
});

// NUEVO: Actualizar datos de usuario
usuariosApp.put('/usuarios/:id', async (req, res) => {
  const userId = req.params.id;
  const { nombre, email, password, newPassword } = req.body;
  
  // Verificar que al menos un campo se esté actualizando
  if (!nombre && !email && !newPassword) {
    return res.status(400).json({ error: 'Al menos un campo debe ser modificado' });
  }

  try {
    // Primero verificar que el usuario existe
    usuariosDb.query(
      'SELECT id, password FROM usuarios WHERE id = ?',
      [userId],
      async (err, results) => {
        if (err) {
          console.error('Error al buscar usuario:', err);
          return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const usuario = results[0];
        
        // Si se está cambiando la contraseña, verificar la contraseña actual
        if (newPassword && password) {
          const match = await bcrypt.compare(password, usuario.password);
          if (!match) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
          }
        }
        
        // Preparar los datos a actualizar
        const updates = {};
        if (nombre) updates.nombre = nombre;
        if (email) updates.email = email;
        if (newPassword) {
          updates.password = await bcrypt.hash(newPassword, saltRounds);
        }
        
        // Crear la consulta SQL dinámicamente
        const fields = Object.keys(updates);
        const placeholders = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updates);
        
        // Agregar id al final para el WHERE
        values.push(userId);
        
        usuariosDb.query(
          `UPDATE usuarios SET ${placeholders} WHERE id = ?`,
          values,
          (err, updateResult) => {
            if (err) {
              console.error('Error al actualizar usuario:', err);
              return res.status(500).json({ error: 'Error en el servidor' });
            }
            
            if (updateResult.affectedRows === 0) {
              return res.status(404).json({ error: 'No se pudo actualizar el usuario' });
            }
            
            // Obtener los datos actualizados para devolver al cliente
            usuariosDb.query(
              'SELECT id, nombre, email FROM usuarios WHERE id = ?',
              [userId],
              (err, userResults) => {
                if (err) {
                  console.error('Error al obtener usuario actualizado:', err);
                  return res.status(500).json({ error: 'Error en el servidor' });
                }
                
                res.json({
                  message: 'Usuario actualizado correctamente',
                  usuario: userResults[0]
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = usuariosApp;