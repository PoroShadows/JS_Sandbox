var express = require('express');
var ejs = require('ejs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var join = require('path').join;

var app = express();
console.log(2);

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(require('stylus'))
app.use(express.static(join(__dirname, '..', 'public')));

require('./routes')(app);
module.exports = exports = app;
//export default app