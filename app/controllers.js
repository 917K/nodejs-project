var fs = require('fs');
var path = require('path');
var log = require('./log')(module);

module.exports = function(dir, app){
	var dirpath = path.join(__dirname, './', dir);
  	fs.readdirSync(dirpath).forEach(function(name) {
    	name = name.slice(0, -3);
     	//log.info('/' + name);
      var file = require(dirpath + '/' + name);
      app.use(file);
  });
};