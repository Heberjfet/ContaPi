const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Opciones compartidas para todos los proxies
const proxyOptions = {
  changeOrigin: true,
  logLevel: 'silent', // Reduce logs innecesarios
};

// Configuración de proxies para cada servicio
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
}));

app.listen(PORT, () => {
  console.log(`API Gateway ejecutándose en http://localhost:${PORT}`);
});
