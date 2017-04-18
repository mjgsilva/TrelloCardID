'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
  const app = (0, _express2.default)();
  //setupDB();
  (0, _middleware2.default)(app);
  const server = new _server2.default(app);
  return _bluebird2.default.resolve(server);
}

module.exports = init;