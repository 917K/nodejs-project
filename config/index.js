// set up ======================================================================
// get all the tools we need
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var swig = require('swig');
var nconf = require('nconf');
var path = require('path');
var log = require('../app/log')(module);

module.exports = function(app) {
	// configuration ===============================================================
	nconf.argv()
       .env()
       .file({ file: path.join(__dirname, 'config.json') });

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	  extended: true
	}));

	require('../app/passport')(passport); // pass passport for configuration

	// view engine setup
	app.engine('html', swig.renderFile);
	app.set('views', './views');
	app.set('view engine', 'html');

	// required for passport
	app.use(session({
		secret: 'vidyapathaisalwaysrunning',
		saveUninitialized: true,
	    resave: true
	})); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

	// routes ======================================================================
	require('.././app/routes.js')(app); // load our routes and pass in our app and fully configured passport

	var port = nconf.get('port');
	app.listen(port);
	log.info('The server is running on port ' + port);
};