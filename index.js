// proxyServer.js
const http = require('http');
const { createProxyServer } = require('http-proxy');

const proxy = createProxyServer();

const server = http.createServer((req, res) => {
    // Proxy requests to the local GoPro API
    proxy.web(req, res, { target: 'http://192.168.1.10:3000' });
});

server.listen(8080, () => {
    console.log('Proxy server listening on port 8080');
});
