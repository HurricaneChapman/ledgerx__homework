const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/api/ws',
        createProxyMiddleware({
            target: 'wss://trade.ledgerx.com',
            changeOrigin: true,
            ws: true
        })
    );
    // app.use(
    //     '/api/**',
    //     createProxyMiddleware({
    //         target: 'https://trade.ledgerx.com',
    //         changeOrigin: true,
    //     })
    // );
};
