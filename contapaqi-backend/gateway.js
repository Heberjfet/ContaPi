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
  logLevel: 'silent' // Reduce logs innecesarios
};

// Configuración de proxies para cada servicio
app.use('/api/usuarios', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/usuarios': '/' // Reescribe /api/usuarios -> /
    }
}));

app.use('/api/usuarios/login', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/usuarios/login': '/login' // Reescribe /api/usuarios/login -> /login
    }
}));

app.use('/api/usuarios/recuperar-password', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/usuarios/recuperar-password': '/recuperar-password'
    }
}));

app.use('/api/empresas', createProxyMiddleware({ 
    ...proxyOptions,
    target: 'http://localhost:3002',
    pathRewrite: {'^/api/empresas': ''}
}));

app.use('/api/cuentas', createProxyMiddleware({ 
    ...proxyOptions,
    target: 'http://localhost:3003',
    pathRewrite: {'^/api/cuentas': ''}
}));

app.listen(PORT, () => {
    console.log(`API Gateway ejecutándose en http://localhost:${PORT}`);
});
