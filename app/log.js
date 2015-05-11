var winston = require('winston');

function getLogger(module) {
	var path = module.filename.split('\\').slice(-2).join('/');

	return new winston.Logger({
		transports: [
			new winston.transports.Console({
				colorize: true,
				level: 'debug',
				label: path,
				timestamp: true
			}),
			new (winston.transports.File)({
		      name: 'info',
		      filename: './logs/info.log',
		      level: 'info',
		      json: false
		    }),
		    new (winston.transports.File)({
		      name: 'warn',
		      filename: './logs/warn.log',
		      level: 'warn',
		      json: false
		    }),
		    new (winston.transports.File)({
		      name: 'error',
		      filename: './logs/error.log',
		      level: 'error',
		      handleExceptions: true,
		      exitOnError: false,
		      json: false
		    })
		]
	});
}

module.exports = getLogger;