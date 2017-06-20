'use strict';

var _index = require('../../routes/index');

var _index2 = _interopRequireDefault(_index);

var _dashboard = require('../../routes/dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _trello = require('../../routes/trello');

var _trello2 = _interopRequireDefault(_trello);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupAPI(app) {
  app.use('/', _index2.default);
  app.use('/me', _dashboard2.default);
  app.use('/trello', _trello2.default);
}

module.exports = setupAPI;