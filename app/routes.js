var log = require('./log')(module);
var nconf = require('nconf');
//var controllers = require('./controllers');

module.exports = function(app) {
	app.use(function (req, res, next) {
		log.info(req.method, req.url);
		next();
	});

	/**
	 * Auto build routes from folder routes
	 */
	//controllers.routesBuilder('controllers', app);
	require('./controllers')('routes/web', app);
	var apiVersions = nconf.get('api_versions');
	for (var i = 0; i < apiVersions.length; i++) {
		require('./controllers')('routes/api/' + apiVersions[i], app);
	}

	// =====================================
	// ERROR ==============================
	// =====================================
	// development error handler
	// will print stacktrace
	if (nconf.get('env') === 'development') {
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.send(err);
			log.error(err.stack);
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
		log.error(err.stack);
	});
};