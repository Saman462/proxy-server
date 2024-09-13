const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// CORS Middleware to handle cross-origin requests
app.use(cors({
    origin: 'https://gopro-app.vercel.app', // Your frontend domain
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));

// Handle root URL to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Proxy server is running!');
});

// Proxy API requests to the GoPro server
app.use('/api', createProxyMiddleware({
    target: 'http://10.5.5.9:8080', // Proxy target server
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^/api': '/gopro', // Rewrite path from /api to /gopro
    },
    on: {
        proxyRes: (proxyRes, req, res) => {

            res.setHeader('Access-Control-Allow-Origin', 'https://gopro-app.vercel.app');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        },

    }
}));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
