var controllers = {};
var fs = require('fs');
var path = require('path');
var log = require('./log')(module);

controllers.routesBuilder = function(dir, app){
	var dirpath = path.join(__dirname, './', dir);
  	fs.readdirSync(dirpath).forEach(function(name) {
  	name = name.slice(0, -3);
   	//log.info(name);
    var obj = require(dirpath + '/' + name);
    //var name = obj.name || name;
    var prefix = obj.prefix || '';
    //var app = express();
    var handler;
    var method;
    var path;

    // allow specifying the view engine
    //app.set('views', __dirname + '/../controllers/' + name + '/views');

    // generate routes based
    // on the exported methods
    for (var key in obj) {
      // "reserved" exports
      if (~['before'].indexOf(key)) continue;
      // route exports
      switch (key) {
        case 'show':
          method = 'get';
          path = '/' + name + '/:' + name + '_id';
          break;
        case 'list':
          method = 'get';
          path = '/' + name + 's';
          break;
        case 'edit':
          method = 'get';
          path = '/' + name + '/:' + name + '_id/edit';
          break;
        case 'update':
          method = 'post';
          path = '/' + name + '/:' + name + '_id';
          break;
        case 'create':
          method = 'post';
          path = '/' + name;
          break;
        case 'login':
          method = 'post';
          path = '/' + name;
          break;
        case 'logout':
          method = 'get';
          path = '/' + name + '/logout';
          break;
        case 'index':
          method = 'get';
          path = '/';
          break;
        default:
          throw new Error('unrecognized route: ' + name + '.' + key);
      }

      // setup
      handler = obj[key];
      path = prefix + path;
      log.info(key);
      // before middleware support
      if (obj.before) {
        app[method](path, obj.before, handler);
        //log.info('     %s %s -> before -> %s', method.toUpperCase(), path, key);
      } else {
        app[method](path, handler);
        //log.info('     %s %s -> %s', method.toUpperCase(), path, key);
      }
    }

    // mount the app
    //parent.use(app);
  });
};

module.exports = controllers;