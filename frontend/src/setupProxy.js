const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      // Explicitly don't rewrite paths to ensure the /api prefix is preserved
      pathRewrite: undefined,
      // Log everything for debugging
      logLevel: 'debug',
      // Error handling
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.writeHead(502, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({
          error: 'Proxy error',
          message: err.message
        }));
      }
    })
  );
}; 