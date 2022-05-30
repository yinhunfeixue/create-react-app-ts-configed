const { createProxyMiddleware } = require('http-proxy-middleware');

const config = {
  '/quantchiAPI': {
    target: 'http://192.168.2.45:82/',
    changeOrigin: true,
  },
};

module.exports = (app) => {
  if (config) {
    for (let key in config) {
      app.use(key, createProxyMiddleware(config[key]));
    }
  }
};
