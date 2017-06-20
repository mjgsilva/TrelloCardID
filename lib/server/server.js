'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _err_en = require('./logger/err_en');

var _err_en2 = _interopRequireDefault(_err_en);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Server(app) {
  this.app = app;
  this.server = null;
}

Server.prototype.start = function start(port, host) {
  const self = this;

  return new _bluebird2.default((resolve, reject) => {
    if (!self.app) {
      reject(_logger2.default.createError(_err_en2.default.server.appNotDefined));
    } else if (!port || !host) {
      reject(_logger2.default.createError(_err_en2.default.server.invalidParams));
    } else if (!(0, _utils.isPortValid)(port)) {
      reject(_logger2.default.createError(_err_en2.default.server.invalidPort));
    }

    self.server = self.app.listen(port, host);

    self.server.on('error', err => {
      if (err.errno === 'EADDRINUSE') {
        reject(_logger2.default.createError(_err_en2.default.server.addressInUse(port)));
      } else {
        reject(_logger2.default.createError(_err_en2.default.server.errorOnStart(err.errno)));
      }
    });

    self.server.on('listening', () => {
      self.serverListening();
      resolve(self);
    });
  });
};

Server.prototype.serverListening = function serverListening() {
  _logger2.default.logInfo('Trello Card ID - Up and running!');
};

module.exports = Server;