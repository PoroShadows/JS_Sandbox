var app = require('./app');
var debug = require('debug')('Server:Sandbox');
var https = require('https');
var join = require('path').join;
var fs = require('fs');

var port = normalizePort(process.env.PORT || '8080');

var server = https.createServer({
   key: fs.readFileSync(join(__dirname, '..', 'key.pem')),
   cert: fs.readFileSync(join(__dirname, '..', './server.crt'))
}, app).listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {String|Number} val
 * @returns {Number|String|Boolean}
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    // If 'val' is a pipe
    return isNaN(port) ? val :
        // If 'port' is a valid port
        port >= 0 && port <= 65535 ? port :
        // 'val' is not a valid value
        false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}