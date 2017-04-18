'use strict';

var _lodash = require('lodash');

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.Console({ colorize: true })]
});

const customLogger = {

  logError(error) {
    logger.error(error.message);
  },

  logWarn(error) {
    logger.warn(error.message);
  },

  logInfo(info) {
    logger.info(info);
  },

  logErrorAndExit(error) {
    this.logError(error);
    process.exit(-1);
  },

  logWarnAndExit(error) {
    this.logWarn(error);
    process.exit(-1);
  },

  logInfoAndExit(info) {
    this.logInfo(info);
    process.exit(0);
  },

  createError(error) {
    if (!error) {
      return new Error('An error occurred');
    }

    if ((0, _lodash.isString)(error)) {
      return new Error(error);
    }

    return error;
  }
};

module.exports = customLogger;