const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        createProxyMiddleware('/api/ws',{
            target: 'wss://trade.ledgerx.com',
            // changeOrigin: true,
            ws: true,
            logLevel: 'debug',
            headers: {Host: 'trade.ledgerx.com', Origin: 'https://trade.ledgerx.com'}
        })
    );
    app.use(
        createProxyMiddleware('/api/**',{
            target: 'https://trade.ledgerx.com',
            changeOrigin: true,
            logLevel: 'debug'
        })
    );
};
