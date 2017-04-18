'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _logger = require('./server/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

(0, _server2.default)().then(authServer => authServer.start(port, host)).catch(err => _logger2.default.logErrorAndExit(err));