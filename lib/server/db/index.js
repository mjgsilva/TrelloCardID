'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupPromises() {
  _mongoose2.default.Promise = global.Promise;
}

function setupDBConn() {
  const {
    MONGOOSE_DOMAIN: domain,
    MONGOOSE_USER: user,
    MONGOOSE_PWD: pwd,
    MONGOOSE_PORT: port,
    MONGOOSE_DB: db
  } = _helpers2.default.getDBVars();

  const conn = `mongodb://${user}:${pwd}@${domain}:${port}/${db}`;

  const opts = {
    server: {
      socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 },
      poolSize: 5
    },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
    }
  };

  _mongoose2.default.connect(conn, opts);
}

function setupDBEvents() {
  _mongoose2.default.connection.on('connected', () => {
    _logger2.default.logInfo('DB > Conn established');
  });

  _mongoose2.default.connection.on('error', err => {
    const dbErr = new Error(`DB > Conn err : ${err}`);
    _logger2.default.logError(dbErr);
  });

  _mongoose2.default.connection.on('disconnected', () => {
    const dbDisconnect = new Error('DB > Conn disconnected');
    _logger2.default.logWarn(dbDisconnect);
  });

  process.on('SIGINT', () => {
    _mongoose2.default.connection.close(() => {
      const forceDisconnect = new Error('DB > Conn disconnected due to app term');
      _logger2.default.logWarnAndExit(forceDisconnect);
    });
  });
}

function initDB() {
  setupPromises();
  setupDBConn();
  setupDBEvents();
}

module.exports = initDB;