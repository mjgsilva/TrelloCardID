import mongoose from 'mongoose';

import logger from '../logger';
import helpers from './helpers';


function setupPromises() {
  mongoose.Promise = global.Promise;
}


function setupDBConn() {
  const {
    MONGOOSE_DOMAIN: domain,
    MONGOOSE_USER: user,
    MONGOOSE_PWD: pwd,
    MONGOOSE_PORT: port,
    MONGOOSE_DB: db,
  } = helpers.getDBVars();

  const conn = `mongodb://${user}:${pwd}@${domain}:${port}/${db}`;

  const opts = {
    server: {
      socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 },
      poolSize: 5,
    },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 },
    },
  };

  mongoose.connect(conn, opts);
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
  setupPromises();
  setupDBConn();
  setupDBEvents();
}

module.exports = initDB;
