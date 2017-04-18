'use strict';

var _index = require('../../routes/index');

var _index2 = _interopRequireDefault(_index);

var _login = require('../../routes/login');

var _login2 = _interopRequireDefault(_login);

var _logout = require('../../routes/logout');

var _logout2 = _interopRequireDefault(_logout);

var _dashboard = require('../../routes/dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _auth = require('../../routes/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupAPI(app) {
  app.use('/', _index2.default);
  app.use('/login', _login2.default);
  app.use('/logout', _logout2.default);
  app.use('/dashboard', _dashboard2.default);
  app.use('/auth_callback', _auth2.default);
}

module.exports = setupAPI;