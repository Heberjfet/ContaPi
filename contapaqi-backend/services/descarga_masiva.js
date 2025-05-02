// services/descarga_masiva.js
const express = require('express');
const cors = require('cors');
const { createService } = require('../gateway');

// Arrancamos en el puerto 3006 para no chocar con Transacciones (3005)
const { app: descargaApp, db: descargaDb } = createService(3006, 'DescargaMasiva');

descargaApp.use(cors());
descargaApp.use(express.json());

descargaApp.get('/descarga_masiva', (req, res) => {
  const sql = `
    SELECT id, folio_fiscal, rfc, nombre_razon_social
    FROM descarga_masiva
  `;
  descargaDb.query(sql, (err, results) => {
    if (err) {
      console.error('Error obteniendo datos de descarga_masiva:', err);
      return res.status(500).json({ error: 'Error interno al obtener los datos.' });
    }
    console.log(`DescargaMasiva: encontrados ${results.length} registros`);
    res.json(results);
  });
});

module.exports = descargaApp;
