var express = require('express');
var app = express();
//var socketIO = require('socket.io');
var https = require('https');

app.get('/', function (req, res) {
    console.log('welp got request...');
});

var lex = require('letsencrypt-express').create({
    server: 'staging',
    challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
    store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }),
    email: 'sickan843@live.se',
    agreeTos: true,
    approveDomains: ['test.jcodegamers.net'],
    renewWithin: (91 * 24 * 60 * 60 * 1000),
    renewBy: (90 * 24 * 60 * 60 * 1000)
})

require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
    console.log("Listening for ACME http-01 challenges on", this.address())
})

var server = require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
    console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
})
/*
var io = socketIO.listen(server);
io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});*/