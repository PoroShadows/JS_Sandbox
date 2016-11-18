'use strict'
const Bound = require('../public/src/js/Bound')
Bound.flow(function *() {
    try {
        const debug = require('debug')('Server:Sandbox')
        const app = require('./app')

        let server

        try {
            const files = yield Bound.all(function*() {
                const readFile = Bound.promisify(require('fs').readFile)
                for (let i = 0, paths = ['key.pem', 'server.crt']; i < paths.length; i++)
                    yield readFile(require('path').join(__dirname, '..', paths[i]), 'utf-8')
            })
            require('http').createServer(require('redirect-https')()).listen(80)
            server = require('spdy').createServer({ key: files[0], cert: files[1] }, app).listen(443)
        } catch (e) {
            server = require('http').createServer(app).listen(80)
        }

        const bind = () => {
            const address = server.address()
            return typeof address === 'string'
                ? 'pipe ' + address
                : 'port ' + address.port
        }

        server.on('error', error => {
            //noinspection SpellCheckingInspection
            throw error['code'] === 'EACCES' ? bind() + ' requires elevated privileges' :
                error['code'] === 'EADDRINUSE' ? bind() + ' is already in use' : error
        })
        server.on('listening', () => {
            debug('Listening on ' + bind())
        })
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})