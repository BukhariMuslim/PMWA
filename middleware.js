var router = require('./router'),
	bodyParser = require('body-parser'),
	nunjucks = require('nunjucks'),
	express = require('express'),
	session = require('express-session'),
	uuid = require('uuid'),
	// RedisStore = require('connect-redis')(session),
	FileStore = require('session-file-store')(session),
	// redisClient = require('redis').createClient(),
	dateFilter = require('nunjucks-date-filter'),
	middleware;

middleware = function(app){
	app.use(session({
		store: new FileStore,
		genid: function(req){
			return uuid.v1();
		},
		secret: "Secret String",
		resave: false,
		saveUninitialized: true
	}));
	app.use(express.static('public'));
	app.use(bodyParser.urlencoded({extended: true}));
	router(app);
	app.use(function (req, res, next) {
		if (!req.session) {
			return next(new Error('Session is not available.')); 
		}
		next();
	})
	nunjucks.configure('templates',{
		autoescape: true,
		express: app
	}).addFilter('date', dateFilter);;
};


module.exports = middleware;