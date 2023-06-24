const { createProxyMiddleware } = require('http-proxy-middleware');

const config = {
  '/baiduApi': {
    target: 'http://www.baidu.com/',
    changeOrigin: true,
    pathRewrite: { '^/baiduApi': '/s' },
  },
  '/services': {
    target: 'http://10.128.27.222:8080',
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
