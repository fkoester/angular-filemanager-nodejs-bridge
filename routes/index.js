/*jslint node: true */
var express = require('express');
var mime = require('mime');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs.extra'));
var path = require('path');
var multer  = require('multer');
var routes = express.Router();
var dateformat = require('../utils/dateformat');
var pathResolver = require('../utils/pathresolver');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(pathResolver.baseDir(req), req.body.destination));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

routes.post('/list', function (req, res, next) {

  console.log(req.body);

  var promise;
  var self = this;
  var fsPath = path.join(pathResolver.baseDir(req), req.body.params.path);

  promise = fs.statAsync(fsPath).then(function(stats) {
    if(!stats.isDirectory()) {
      throw new Error("Directory " + fsPath + ' does not exist!');
    }
  });

  promise = promise.then(function() {
    return fs.readdirAsync(fsPath);
  });

  promise = promise.then(function(fileNames) {

    return Promise.map(fileNames, function(fileName) {

      var filePath = path.join(fsPath, fileName);

      return fs.statAsync(filePath).then(function(stat) {

        return {
          name: fileName,
          rights: "drwxr-xr-x", // TODO
          size: stat.size,
          date: dateformat.dateToString(stat.mtime),
          type: stat.isDirectory() ? 'dir' : 'file',
        };
      });
    });
  });

  promise = promise.then(function(files) {
    res.status(200);
    res.send({
      "result": files
    });
  });

  return promise;
});

routes.get('/download', function (req, res, next) {
  console.log(req.query.path);

  var filePath = path.join(pathResolver.baseDir(req), req.query.path);
  var fileName = path.basename(filePath);

  console.log('filePath: ' + filePath);
  console.log('fileName: ' + fileName);

  fs.statAsync(filePath).then(function(stat) {

    if(!stat.isFile()) {
      throw new Error("Cannot access file " + filePath + " (or is no file)");
    }

    var mimeType = mime.lookup(filePath);
    console.log('mimetype: ' + mimeType);

    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', mimeType);

    var filestream = fs.createReadStream(filePath);
    filestream.pipe(res);

  });
});

routes.post('/upload', upload.any(), function (req, res, next) {
  console.log(req.files);
  res.status(200);
  res.send({
    "result": {
      "success": true,
      "error": null
    }
  });
});

routes.post('/remove', upload.any(), function (req, res, next) {

  var filePath = path.join(pathResolver.baseDir(req), req.body.params.path);
  var promise = fs.unlinkAsync(filePath);

  promise = promise.then(function() {
    res.status(200);
    res.send({
      "result": {
        "success": true,
        "error": null
      }
    });
  });

  return promise;
});

routes.post('/createFolder', upload.any(), function (req, res, next) {

  var folderPath = path.join(pathResolver.baseDir(req), req.body.params.path, req.body.params.name);
  console.log(folderPath);
  var promise = fs.mkdirAsync(folderPath, 0o777);

  promise = promise.then(function() {
    res.status(200);
    res.send({
      "result": {
        "success": true,
        "error": null
      }
    });
  });

  return promise;
});

module.exports = routes;
