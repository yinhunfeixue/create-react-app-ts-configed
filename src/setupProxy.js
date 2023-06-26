const { createProxyMiddleware } = require('http-proxy-middleware')

let URL = 'http://192.168.2.45:83'

const preList = [
    '/v3',
    '/browser',
    '/tdc',
    '/quantchiAPI/api/umg',
    '/quantchiAPI',
    '/service-workflow',
    '/service-task',
    '/service_search',
    '/search',
    '/service-qa',
    '/api',
    '/service-datacollect',
    '/service-auth',
    '/service-girm',
]

module.exports = (app) => {
    preList.forEach((item) => {
        app.use(
            item,
            createProxyMiddleware({
                target: URL,
                changeOrigin: true,
            })
        )
    })
}
