const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

<<<<<<< HEAD
// Opciones compartidas para todos los proxies
const proxyOptions = {
  changeOrigin: true,
  logLevel: 'silent', // Reduce logs innecesarios
};

// Configuración de proxies para cada servicio
<<<<<<< HEAD
app.use('/api/usuarios', createProxyMiddleware({
  ...proxyOptions,
  target: 'http://localhost:3001', // Servicio de usuarios
  pathRewrite: { '^/api/usuarios': '' }, // Reescribe /api/usuarios -> /
}));

app.use('/api/empresas', createProxyMiddleware({
  ...proxyOptions,
  target: 'http://localhost:3002', // Servicio de empresas
  pathRewrite: { '^/api/empresas': '' }, // Reescribe /api/empresas -> /
}));

app.use('/api/cuentas', createProxyMiddleware({
  ...proxyOptions,
  target: 'http://localhost:3003', // Servicio de cuentas
  pathRewrite: { '^/api/cuentas': '' }, // Reescribe /api/cuentas -> /
=======
// Configuración de proxies para cada servicio
app.use('/api/usuarios', createProxyMiddleware({ 
    target: 'http://localhost:3001',
    pathRewrite: {'^/api/usuarios': ''},
    changeOrigin: true
=======
app.use('/api/usuarios', createProxyMiddleware({ 
    ...proxyOptions,
    target: 'http://localhost:3001',
    pathRewrite: {'^/api/usuarios': ''}
>>>>>>> parent of 8276cfc (se cambiaros algunas rutas del api pára revisar el funcionamiento)
}));

app.use('/api/empresas', createProxyMiddleware({ 
    target: 'http://localhost:3002',
    pathRewrite: {'^/api/empresas': ''},
    changeOrigin: true
}));

app.use('/api/cuentas', createProxyMiddleware({ 
    target: 'http://localhost:3003',
    pathRewrite: {'^/api/cuentas': ''},
    changeOrigin: true
>>>>>>> parent of 2d8526b (Refactor configuración de proxies en gateway.js y simplificación de scripts en binarios)
}));

app.listen(PORT, () => {
  console.log(`API Gateway ejecutándose en http://localhost:${PORT}`);
});
