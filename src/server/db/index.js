import mongoose from 'mongoose';

import logger from '../logger';
import helpers from './helpers';

function setupDBConn() {
  const {
    MONGOOSE_DOMAIN: domain,
    MONGOOSE_USER: user,
    MONGOOSE_PWD: pwd,
    MONGOOSE_PORT: port,
    MONGOOSE_DB: db,
  } = helpers.getDBVars();

  const conn = `mongodb://${user}:${pwd}@${domain}:${port}/${db}`;
  mongoose.connect(conn);
}


function setupDBEvents() {
  mongoose.connection.on('connected', () => {
    logger.logInfo('DB > Conn established');
  });

  mongoose.connection.on('error', (err) => {
    const dbErr = new Error(`DB > Conn err : ${err}`);
    logger.logError(dbErr);
  });

  mongoose.connection.on('disconnected', () => {
    const dbDisconnect = new Error('DB > Conn disconnected');
    logger.logWarn(dbDisconnect);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      const forceDisconnect = new Error('DB > Conn disconnected due to app term');
      logger.logWarnAndExit(forceDisconnect);
    });
  });
}


function initDB() {
  setupDBConn();
  setupDBEvents();
}

module.exports = initDB;
