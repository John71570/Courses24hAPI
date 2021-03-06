var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');

var https = require('https');
var fs = require('fs');

var indexRouter = require('./routes/index');
var coureurRouter = require('./routes/coureur');
var equipeRouter = require('./routes/equipe');
var categorieRouter = require('./routes/categorie');

var app = express();

/* https.createServer({
	key: fs.readFileSync('./config/key.pem'),
	cert: fs.readFileSync('./config/cert.pem')
}, app).listen(3011); */

//------------------------------ All required modules from Planizi repository -----------------------------------
var authenticationConfig = require('./config/config-authentication');
authenticationConfig.localAuthenticationConfiguration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: "key"
}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css',express.static(path.join(__dirname,'public/css')));
app.use('/js',express.static(path.join(__dirname,'public/js')));
app.use('/vendor',express.static(path.join(__dirname,'public/vendor')));
app.use('/javascripts',express.static(path.join(__dirname,'public/javascripts')));

app.use('/', indexRouter);
app.use('/coureur', coureurRouter);
app.use('/equipe', equipeRouter);
app.use('/categorie', categorieRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log('ERROR ---> '+err+'\n'+err.message);

	res.status(err.status || 500);
	res.send(err+" --- "+err.message);
});

module.exports = app;
