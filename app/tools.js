var tools = {};
var path = require('path');
var fs = require('fs');
var log = require('./log');

/**
 * Return full paths of files in directory
 * @method  filepathGetter
 * @param  {[string]} dir  directory name
 * @param  {[string]} currentDirPath  current path of directory
 * @return {[array]}  filepath array
 */
tools.filepathGetter = function (dir, currentDirPath) {
	var dirpath = (currentDirPath) ? (currentDirPath + '/' + dir) : path.join(__dirname, '..', dir);
	console.log(log);
	var files = fs.readdirSync(dirpath);
	var filepathArray = [];
	files.forEach(function (filename) {
		if (/\./.test(filename)) {
			var filepath = dirpath + '/' + filename;
			if (fs.statSync(filepath).isDirectory()) {
				tools.filepathGetter(filepath);
			} else {
				filepathArray.push(filepath);
			}
		}
	}, this);
	return filepathArray;
}

/**
 * return filename of full path directory
 * @method  cutToFilename
 * @param  {[string]} path full path file
 * @return {[sting]}      filename
 */
function cutToFilename(path) {
	var filename = path.match(/(?!\/)(\w+)\.js/);
	return filename && filename[1];
}

/**
 * Return array of required modules
 * @method  builder
 * @param  {[string]} dir  directory name
 * @param  {[string]} currentDirPath current path of directory __dirname
 * @return {[array]}  required modules
 */
tools.builder = function (dir, dirname) {
	var files = tools.filepathGetter(dir, dirname);
	var includedFiles = {};
	files.forEach(function (filepath) {
		if (/\.js/.test(filepath)) {
			var filename = cutToFilename(filepath);
			includedFiles[filename] = require(filepath)[filename];
		}
	}, this);
	return includedFiles;
}

function filenameSwitcher(includedFile, filename) {
	var inc_name = includedFile.include_name
	if (inc_name || inc_name === '') {
		return '/api/' + inc_name;
	} else {
		return '/api/' + filename
	}
}

/**
 * Included routes by directory name
 * @method routesBuilder
 * @param  {[string]} dir directory name
 * @param  {[boolean]} debug show info in console
 */
tools.routesBuilder = function (dir, app, debug) {
	var dirpath = path.join(__dirname, '..', dir);
	var files = tools.filepathGetter(dir);
	files.forEach(function (filepath) {
		var filename = cutToFilename(filepath);
		var includedFile = require(filepath.replace(/\.js/, ''));
		var include_name = filenameSwitcher(includedFile, filename)
		if (debug) {
			log.info('-- INCLUDE "' + filename + '" with name - ' + include_name);
		}
		app.use(include_name, includedFile);
	}, this);
}

module.exports = tools;