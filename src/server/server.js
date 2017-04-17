// @flow

import Promise from 'bluebird';

import errors from './errors';
import errorsServer from './errors/en';
import { isPortValid } from './utils';


function Server(app: Object) {
  this.app = app;
  this.server = null;
}


Server.prototype.start = function start(port: string, host: Object): Promise<any> {
  const self = this;

  return new Promise((resolve, reject) => {
    if (!self.app) {
      reject(errors.createError(errorsServer.server.appNotDefined));
    } else if (!port || !host) {
      reject(errors.createError(errorsServer.server.invalidParams));
    } else if (!isPortValid(port)) {
      reject(errors.createError(errorsServer.server.invalidPort));
    }

    self.server = self.app.listen(port, host);

    self.server.on('error', (err) => {
      if (err.errno === 'EADDRINUSE') {
        reject(errors.createError(errorsServer.server.addressInUse(port)));
      } else {
        reject(errors.createError(errorsServer.server.errorOnStart(err.errno)));
      }
    });

    self.server.on('listening', () => {
      self.serverListening();
      resolve(self);
    });
  });
};


Server.prototype.serverListening = function serverListening(): void {
  errors.logInfo('Trello Card ID - Up and running!');
};

module.exports = Server;
