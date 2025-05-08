const { createService: createDM } = require('../gateway');
createDM(3006, 'DescargaMasiva').then(({ app, dbs }) => {
  const { breaker } = dbs;

  app.get('/descarga_masiva', async (req, res) => {
    try {
      const [results] = await breaker.fire(
        'SELECT id, folio_fiscal, rfc, nombre_razon_social FROM descarga_masiva',
        []
      );
      console.log(`DescargaMasiva: encontrados ${results.length} registros`);
      return res.json(results);
    } catch (err) {
      console.error('Error en descarga_masiva:', err);
      return res.status(500).json({ error: 'Error interno al obtener los datos.' });
    }
  });
});