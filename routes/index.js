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

  var promise;
  var self = this;
  var fsPath = path.join(pathResolver.baseDir(req), req.body.path);

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

  promise = promise.catch(function(err) {
    res.status(500);
    res.send({
      "result": {
        "success": false,
        "error": err
      }
    });
  });

  return promise;
});

routes.get('/download', function (req, res, next) {

  var filePath = path.join(pathResolver.baseDir(req), decodeURIComponent(req.query.path));
  var fileName = path.basename(filePath);
  var promise;
  console.log('filepath',filePath);
  promise = fs.statAsync(filePath);

  promise = promise.then(function(stat) {

    if(!stat.isFile()) {
      console.log("Cannot access file " + filePath + " (or is no file)");
      throw new Error("Cannot access file " + filePath + " (or is no file)");
    }

    var mimeType = mime.lookup(filePath);
    console.log('mimetype: ' + mimeType);

    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', mimeType);

    var filestream = fs.createReadStream(filePath);
    filestream.pipe(res);
  });

  promise = promise.catch(function(err,stats) {
    res.status(500);
    res.send({
      "result": {
        "success": false,
        "error": JSON.stringify(err),
        "stats": stats
      }
    });
  });

  return promise;
});

routes.post('/upload', upload.any(), function (req, res, next) {

  res.status(200);
  res.send({
    "result": {
      "success": true,
      "error": null
    }
  });
});

routes.post('/remove', upload.any(), function (req, res, next) {

  var filePath = path.join(pathResolver.baseDir(req), req.body.path);
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

  promise = promise.catch(function(err) {
    res.status(500);
    res.send({
      "result": {
        "success": false,
        "error": err
      }
    });
  });

  return promise;
});

routes.post('/createFolder', upload.any(), function (req, res, next) {

  var folderPath = path.join(pathResolver.baseDir(req), req.body.path, req.body.name);
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

  promise = promise.catch(function(err) {
    res.status(500);
    res.send({
      "result": {
        "success": false,
        "error": err
      }
    });
  });

  return promise;
});

routes.post('/rename', function (req, res, next) {

  var oldPath = path.join(pathResolver.baseDir(req), req.body.path);
  var newPath = path.join(pathResolver.baseDir(req), req.body.newPath);

  var promise = fs.renameAsync(oldPath, newPath);

  promise = promise.then(function() {
    res.status(200);
    res.send({
      "result": {
        "success": true,
        "error": null
      }
    });
  });

  promise = promise.catch(function(err) {
    res.status(500);
    res.send({
      "result": {
        "success": false,
        "error": err
      }
    });
  });

  return promise;
});

routes.post('/copy', function (req, res, next) {

  var oldPath = path.join(pathResolver.baseDir(req), req.body.path);
  var newPath = path.join(pathResolver.baseDir(req), req.body.newPath);

  var promise = fs.copyAsync(oldPath, newPath);

  promise = promise.then(function() {
    res.status(200);
    res.send({
      "result": {
        "success": true,
        "error": null
      }
    });
  });

  promise = promise.catch(function(err) {
    res.status(500);
    res.send({
      "result": {
        "success": false,
        "error": err
      }
    });
  });

  return promise;
});

routes.post('/getContent', function (req, res, next) {
  res.status(200);
  var filePath = path.join(pathResolver.baseDir(req), req.body.item);
  var promise = fs.readFileAsync(filePath,'utf8');
  console.log(req);
  promise = promise.then(function (resolve){
    console.log(resolve);
    res.status(200);
    res.send({
      "result": resolve
    });
  });

  promise=promise.catch(function (err){
    res.status(500);
    res.send({
      "result": {
        "success": false,
        "error": err
      }
    });
  });

  return promise;
});

routes.post('/edit', function (req, res, next) {
  var filePath = path.join(pathResolver.baseDir(req), req.body.item);

  var promise;

  if (req.body.content){
    promise = fs.writeFileAsync(filePath, req.content , 'utf8');
  } else {
    res.status(400);
    return res.send({
      "result":{
        "success":"false",
        "error": "bad request",
      }
    });
  }

  promise = promise.then(function (resolve){
    res.status(200);
    res.send({
      "result":{
        "success": true,
        "error": null
      }
    });
  });

  promise = promise.catch(function (err){
    res.status(500);
    res.send({
      "result": {
        "success": false,
        "error": err
      }
    });
  });
});
module.exports = routes;
