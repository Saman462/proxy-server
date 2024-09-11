const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');  // Import cors middleware

const app = express();

// Use CORS middleware to allow requests from any origin
app.use(cors());

app.use('/api', createProxyMiddleware({
    target: 'http://10.5.5.9:8080', // Your GoPro API server
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove the '/api' prefix before forwarding the request
    },
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
