'use strict'
const WaterStream = require('./WaterStream')
WaterStream.flow(function *() {
    const debug = require('debug')('Server:Sandbox')
    const app = require('./app')

    const join = require('path').join.bind(null, __dirname, '..')
    const readFile = WaterStream.promisify(require('fs').readFile)

    const port = (val => {
        const port = parseInt(val, 10)
        return isNaN(port) ? val : port >= 0x0000 && port <= 0xffff ? port : false
    })(process.env.PORT || '8080')

    const files = yield WaterStream.all([
        readFile(join('key.pe'), 'utf-8'),
        readFile(join('server.crt'), 'utf-8')
    ]).then(t => t).catch(reason => console.error(reason))

    console.log('hi:', Array.isArray(files), files)
/*
    const server = yield WaterStream.all([
        readFile(join('key.pe')),
        readFile(join('server.crt'))
    ]).then((files) => require('https').createServer({ key: files[0], cert: files[1] }, app)).catch(() => require('http').createServer(app))




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
    })*/
}).catch(error => {
    console.error(error)
    process.exit(1)
})