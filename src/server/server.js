// @flow

import Promise from 'bluebird';

import logger from './logger';
import errorsServer from './logger/err_en';
import { isPortValid } from './utils';


function Server(app: Object) {
  this.app = app;
  this.server = null;
}


Server.prototype.start = function start(port: string, host: Object): Promise<any> {
  const self = this;

  return new Promise((resolve, reject) => {
    if (!self.app) {
      reject(logger.createError(errorsServer.server.appNotDefined));
    } else if (!port || !host) {
      reject(logger.createError(errorsServer.server.invalidParams));
    } else if (!isPortValid(port)) {
      reject(logger.createError(errorsServer.server.invalidPort));
    }

    self.server = self.app.listen(port, host);

    self.server.on('error', (err) => {
      if (err.errno === 'EADDRINUSE') {
        reject(logger.createError(errorsServer.server.addressInUse(port)));
      } else {
        reject(logger.createError(errorsServer.server.errorOnStart(err.errno)));
      }
    });

    self.server.on('listening', () => {
      self.serverListening();
      resolve(self);
    });
  });
};


Server.prototype.serverListening = function serverListening(): void {
  logger.logInfo('Trello Card ID - Up and running!');
};

module.exports = Server;
