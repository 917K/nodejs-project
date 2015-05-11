var mysql = require('mysql');
var log = require('./log');
var config = {
    /*'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': 'root',
        'database': 'node'
    },*/
    'users_table': 'users'
};
var pool = mysql.createPool({
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'node'
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

var query = function(query, callback) {
    getConnection(function(err, connection) {
        if (err) connectErrorHandler();
        else if (connection) {
            connection.query(query, function(err, result, fields) {
                connection.release();
                if (err) queryErrorHandler();
                callback(err, result, fields);
            });
        }
    });
}

var connectErrorHandler = function(err) {
    log.error('DB connection error: ', err.code);
}

var queryErrorHandler = function(err) {
    log.error('DB query error: ', err.code);
}

module.exports = {
	getConnection: getConnection,
	config: config,
    query: query
}; 