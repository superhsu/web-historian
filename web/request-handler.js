var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');

// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var header = http.headers;
  var reqType = req.method;

  // if (reqType === 'GET') {
  //   console.log('gettttttt');
  //   res.setHeader('Content-Type', 'application/json');
  //   if (req.url === '/') {
  //     let asset = __dirname + '/public/index.html';
  //     http.serveAssets(res, asset, function(err, data) {
  //       if (err) {
  //         res.writeHead(404);
  //         res.end();
  //         return;
  //       }
  //       res.writeHead(200, header);
  //       res.end(data);
  //     });
  //   } else {
  //     let asset = `${archive.paths.archivedSites}/${req.url}`;
  //     http.serveAssets(res, asset, function(err, data) {
  //       if (err) {
  //         res.writeHead(404);
  //         res.end();
  //         return;
  //       }
  //       res.end(data);
  //     });
  //   }
  // }
  
    if (reqType === 'GET') {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/') {
      let asset = __dirname + '/public/index.html';
      http.serveAssets(res, asset);
    } else {
      let asset = `${archive.paths.archivedSites}/${req.url}`;
      http.serveAssets(res, asset);
    }
  }
  
  if (reqType === 'POST') {
    console.log(req.url);
    req.on('data', (data) => {
      console.log(data);
      let url = data.toString().slice(4);
      console.log(url);
      res.writeHead(302, url);
      archive.isUrlInList(url, (exists) => {
        if (!exists) { 
          archive.addUrlToList(url, () => {
            http.loadingPage(res);
          });
        } else {
          let asset = `${archive.paths.archivedSites}/${url}`;
          http.serveAssets(res, asset);
        }    
      });
    });
  }
};
