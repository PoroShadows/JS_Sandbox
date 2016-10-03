var express = require('express');
var join = require('path').join;
var debug = require('debug')('Server:Sandbox');
module.exports = exports = function (app) {

    /////////////////////////////////////////////////////////////////
    // Handle GET request routes

    app.get('/', function (req, res) {
        res.render('index', {});
    });

    app.get('/kano', function (req, res) {
        debug('fragment' in req.query);
        res.render('kano', {
            newsInfo: [
                { id: 45, date: "2016/8/19", preview: "Newシングル「nameless」発売記念 ツイキャス特番 9月8日21時から放送決定　※9/6更新" },
                { id: 44, date: "2016/8/12", preview: "animelo mixで「nameless」先行配信開始" },
                { id: 43, date: "2016/8/12", preview: "「RERE」MUSIC VIDEO解禁" }
            ],
            liveEvent: [
                { id: 67, date: "2016/8/12", preview: "New Single「nameless」発売記念 特典お渡し会 開催決定" },
                { id: 66, date: "2016/6/12", preview: "鹿乃 ファーストライブ「ばんび～の」​ チケット一般発売開始" }
            ]
        });
    });

    /////////////////////////////////////////////////////////////////
    // Error catching/handling

    // Catch 404 network error and forward to the error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // Error handler
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: app.get('env') === 'development' ?
                // Development environment with error stacktrace
                err :
                // Production environment without error stacktrace
                {}
        });
    });

    /////////////////////////////////////////////////////////////////
    // Static routes


};