require('./WaterStream').flow(function *() {
    const WaterStream = require('./WaterStream').WaterStream
    const debug = require('debug')('Server:Sandbox')
    const app = require('./app')

    const join = require('path').join.bind(null, __dirname, '..')
    const readFile = WaterStream.promisify(require('fs').readFile)

    const port = (val => {
        const port = parseInt(val, 10)
        return isNaN(port) ? val : port >= 0x0000 && port <= 0xffff ? port : false
    })(process.env.PORT || '8080')
    const server = yield WaterStream.all([
        readFile(join('key.pem')),
        readFile(join('server.crt'))
    ]).spread((key, cert) => require('https').createServer({ key, cert }, app)).catch(() => require('http').createServer(app))

    server.listen(port)
    server.on('error', error => {
        const bind = (typeof port === 'string' ? 'Pipe ' : 'Port ') + port
        throw error.code === 'EACCES' ? bind + ' requires elevated privileges' :
            error.code === 'EADDRINUSE' ? bind + ' is already in use' : error
    })
    server.on('listening', () => {
        const address = server.address()
        const bind = typeof address === 'string'
            ? 'pipe ' + address
            : 'port ' + address.port
        debug('Listening on ' + bind)
    })
}).catch(error => {
    console.error(error)
    process.exit(1)
})