'use strict'
const Bound = require('./../public/jscripts/Bound')
Bound.flow(function *() {
    const debug = require('debug')('Server:Sandbox')
    const app = require('./app')

    const readFile = Bound.promisify(require('fs').readFile)

    const port = (val => {
        const port = parseInt(val, 10)
        return isNaN(port) ? val : port >= 0x0000 && port <= 0xffff ? port : false
    })(process.env.PORT || '8080')

    const paths = ['key.pem', 'server.crt']
    let server

    try {
        const files = yield Bound.all(function* () {
            for (let i = 0; i < paths.length; i++)
                yield readFile(require('path').join(__dirname, '..', paths[i]), 'utf-8')
        })
        require('http').createServer(require('redirect-https')()).listen(80)
        server = require('https').createServer({ key: files[0], cert: files[1] }, app)
    } catch (e) {
        server = require('http').createServer(app)
    }

    server.listen(443)
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