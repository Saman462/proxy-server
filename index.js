const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Define CORS middleware
const customCorsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://gopro-app.vercel.app/'); // Your frontend URL
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

// Apply CORS middleware
app.use(customCorsMiddleware);

// Handle root URL to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Proxy server is running!');
});

// Proxy API requests with event handling
app.use('/data', createProxyMiddleware({
    target: 'http://192.168.1.17:3000', // GoPro API server
    changeOrigin: true,
    pathRewrite: {
        '^/data': '',  // Remove /api prefix
    },
    on: {

        proxyRes: (proxyRes, req, res) => {
            // Add the necessary CORS headers to the proxy response
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://gopro-app.vercel.app';  // Your frontend URL
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        },
        error: (err, req, res) => {
            console.error('Proxy error:', err);

        },
    },
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

