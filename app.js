const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const art_template = require('express-art-template');
const mongo = require('mongoose')
const config = require('./model/config')
const featureRouter = require('./routes/feature');

mongo.connect(config.db.url)
const db = mongo.connection
db.on('error', () => { console.error('connect db failed~')})
db.on('open', () => { console.log('connected')})


var app = express();

// view engine setup
app.engine('html', art_template);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static('public'))
app.use(express.static('feature'))
app.use('/feature', featureRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {message: err.message, status:err.status});
});

module.exports = app;
