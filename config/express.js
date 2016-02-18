/*jslint node: true */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');
var cors = require('cors');
var morgan = require('morgan');
var compression = require('compression');

/**
 * Express configuration
 */
module.exports = function(app) {
	var env = app.get('env');

	// Logging
	app.use(morgan('dev'));

	app.use(bodyParser.json());
	app.use(timeout('5s'));
	app.use(compression());
	app.use(cors());
};
