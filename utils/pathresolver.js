/*jslint node: true */

module.exports.baseDir = function(req) {
  return process.env.DATA_DIR;
};

module.exports.pathGuard = function(path) {
  return path.replace(/\.\.\//g,'');
};