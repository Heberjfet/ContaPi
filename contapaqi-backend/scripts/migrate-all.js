const { MongoClient } = require('mongodb');
const mysql = require('mysql2/promise');

async function migrateAll() {
  let mysqlConn;
  let mongoClient;

  try {
    // 1. Conexión a MySQL
    mysqlConn = await mysql.createConnection({
      host: 'localhost',
      user: 'root-contapi',
      password: 'Contapi12@',
      database: 'contapi'
    });

    // 2. Conexión a MongoDB
    mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();
    const mongoDb = mongoClient.db('contapi');

    console.log('🔌 Conexiones establecidas correctamente');

    // 3. Migrar Usuarios
    console.log('⏳ Migrando usuarios...');
    const [usuarios] = await mysqlConn.query('SELECT * FROM usuarios');
    if (usuarios.length > 0) {
      await mongoDb.collection('usuarios').insertMany(
        usuarios.map(u => ({
          mysql_id: u.id,
          nombre: u.nombre,
          email: u.email,
          password: u.password
        }))
      );
      console.log(`✅ Usuarios migrados (${usuarios.length} registros)`);
    } else {
      console.log('⚠️ No hay usuarios para migrar');
    }

    // 4. Migrar Empresas
    console.log('⏳ Migrando empresas...');
    const [empresas] = await mysqlConn.query('SELECT * FROM empresas');
    if (empresas.length > 0) {
      await mongoDb.collection('empresas').insertMany(
        empresas.map(e => ({
          mysql_id: e.id,
          nombre: e.nombre,
          rfc: e.rfc,
          direccion: e.direccion,
          telefono: e.telefono,
          email: e.email,
          usuario_id: e.usuario_id
        }))
      );
      console.log(`✅ Empresas migradas (${empresas.length} registros)`);
    } else {
      console.log('⚠️ No hay empresas para migrar');
    }

    // 5. Migrar Cuentas Madre
    console.log('⏳ Migrando cuentas madre...');
    const [cuentasMadre] = await mysqlConn.query('SELECT * FROM cuentas_madre');
    if (cuentasMadre.length > 0) {
      await mongoDb.collection('cuentas_madre').insertMany(
        cuentasMadre.map(c => ({
          mysql_id: c.id,
          nombre: c.nombre,
          editable: c.editable
        }))
      );
      console.log(`✅ Cuentas madre migradas (${cuentasMadre.length} registros)`);
    } else {
      console.log('⚠️ No hay cuentas madre para migrar');
    }

    // 6. Migrar Subcuentas
    console.log('⏳ Migrando subcuentas...');
    const [subcuentas] = await mysqlConn.query('SELECT * FROM subcuentas');
    if (subcuentas.length > 0) {
      await mongoDb.collection('subcuentas').insertMany(
        subcuentas.map(s => ({
          mysql_id: s.id,
          nombre: s.nombre,
          cuenta_madre_id: s.cuenta_madre_id,
          empresa_id: s.empresa_id,
          editable: s.editable
        }))
      );
      console.log(`✅ Subcuentas migradas (${subcuentas.length} registros)`);
    } else {
      console.log('⚠️ No hay subcuentas para migrar');
      
      // Insertar subcuentas por defecto si es necesario
      const defaultSubcuentas = [
        { mysql_id: 1, nombre: 'Caja y efectivo', cuenta_madre_id: 1, empresa_id: 1, editable: false },
        { mysql_id: 2, nombre: 'Bancos nacionales', cuenta_madre_id: 1, empresa_id: 1, editable: false }
      ];
      
      await mongoDb.collection('subcuentas').insertMany(defaultSubcuentas);
      console.log('➕ Subcuentas por defecto insertadas');
    }

    // 7. Migrar Transacciones
    console.log('⏳ Migrando transacciones...');
    const [transacciones] = await mysqlConn.query('SELECT * FROM transacciones');
    if (transacciones.length > 0) {
      await mongoDb.collection('transacciones').insertMany(
        transacciones.map(t => ({
          mysql_id: t.id,
          fecha: new Date(t.fecha),
          descripcion: t.descripcion,
          monto: t.monto,
          empresa_id: t.empresa_id,
          cuenta_madre_id: t.cuenta_madre_id,
          subcuenta_id: t.subcuenta_id,
          created_at: new Date(t.created_at)
        }))
      );
      console.log(`✅ Transacciones migradas (${transacciones.length} registros)`);
    } else {
      console.log('⚠️ No hay transacciones para migrar');
    }

    console.log('🚀 ¡Migración completada con éxito!');

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error('Detalles:', error.stack);
  } finally {
    // Cerrar conexiones
    if (mysqlConn) await mysqlConn.end();
    if (mongoClient) await mongoClient.close();
    console.log('🔌 Conexiones cerradas');
  }
}

migrateAll();