// @flow

import { isString } from 'lodash';
import winston from 'winston';

const logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)({ colorize: true })],
});

const errors = {

  logError(error: Error): void {
    logger.error(error.message);
  },


  logWarn(error: Error): void {
    logger.warn(error.message);
  },


  logInfo(info: string): void {
    logger.info(info);
  },


  logErrorAndExit(error: Error): void {
    this.logError(error);
    process.exit(-1);
  },


  logInfoAndExit(info: string): void {
    this.logInfo(info);
    process.exit(0);
  },


  createError(error: any): Error {
    if (!error) {
      return new Error('An error occurred');
    }

    if (isString(error)) {
      return new Error(error);
    }

    return error;
  },
};

module.exports = errors;
