var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http'); 
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) { 
      throw err;
    } else {
      callback(data.toString().split('\n'));
    }
  });
};


exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((data) => {
    callback(data.includes(url));
  });
 
};

exports.addUrlToList = function(url, callback) {
  
  fs.appendFile(exports.paths.list, url + '\n', (err, data) => {
    if (err) {
      throw err;
    } else {
      callback(data);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    if (err) {
      throw err;
    }
    callback(files.includes(url));
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, url => {
    let file = fs.createWriteStream(`${exports.paths.archivedSites}/${url}`);
    http.get(`http://${url}`, response => response.pipe(file));
  });
};
