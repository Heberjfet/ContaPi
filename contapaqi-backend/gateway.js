const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de proxies para cada servicio
app.use('/api/usuarios', createProxyMiddleware({ 
    target: 'http://localhost:3001',
    pathRewrite: {'^/api/usuarios': ''},
    changeOrigin: true
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
}));

app.listen(PORT, () => {
    console.log(`API Gateway ejecutándose en http://localhost:${PORT}`);
});
