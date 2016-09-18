var express = require('express');
var join = require('path').join;
module.exports = exports = function (app) {

    /////////////////////////////////////////////////////////////////
    // Handle GET request routes

    app.get('/', function (req, res) {
        res.render('index', {});
    });

    app.get('/kano', function (req, res) {
        res.render('kano', {
            newsInfo: [
                { id: 45, date: "2016/8/19", preview: "全国のJOYSOUND MAX、JOYSOUND f1 でミュージックビデオをバックに歌唱開始" },
                { id: 44, date: "2016/8/12", preview: "「nameless」MUSIC VIDEO解禁" },
                { id: 43, date: "2016/8/12", preview: "「nameless」ジャケット写真公開" }
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