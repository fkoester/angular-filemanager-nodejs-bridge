/*jslint node: true */

var express = require('express');
var http = require('http');
var fs = require('fs');

// Setup default environment variables
process.env.PORT = process.env.PORT || 5000;
process.env.DATA_DIR = process.env.DATA_DIR || '/data';

try {
  fs.accessSync(process.env.DATA_DIR, fs.R_OK | fs.X_OK);
} catch(err) {
  console.error('Cannot access directory %s. Maybe it does not exist?. Please specify a valid data directory by using the environment variable DATA_DIR.', process.env.DATA_DIR);
  process.exit(1);
}

var dataDirStats = fs.statSync(process.env.DATA_DIR);
if(!dataDirStats.isDirectory()) {
  console.error('%s is not a directory. Please specify a valid data directory by using the environment variable DATA_DIR.', process.env.DATA_DIR);
  process.exit(1);
}

var app = express();
var server = http.createServer(app);

require('./config/express')(app);

// Routing
app.use(require('./routes'));

// Start server
server.listen(process.env.PORT, function() {
  console.info('Server started on port %d serving directory %s! Waiting for requests...', process.env.PORT, process.env.DATA_DIR);
});

module.exports.app = app;
module.exports.server = server;
