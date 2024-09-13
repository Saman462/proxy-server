const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// CORS Middleware to handle cross-origin requests
app.use(cors({
    origin: 'https://gopro-app.vercel.app',  // Your frontend domain
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
    target: 'http://10.5.5.9:8080',  // GoPro API server
    changeOrigin: true,
    secure: false,
    on: {
        proxyRes: (proxyRes, req, res) => {
            // Add necessary CORS headers to the proxy response
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://gopro-app.vercel.app'; // Your frontend URL
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        },
        error: (err, req, res) => {

            res.end('Proxy error: ' + err.message);
        },
    },
}));

// Start server on defined port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

