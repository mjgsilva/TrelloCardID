'use strict';

const errors = {
  server: {
    appNotDefined: 'App is not defined - Dependency not satisfied',
    invalidParams: 'Host and Port params are mandatory',
    addressInUse: port => `Another program is already using this port: ${port}`,
    errorOnStart: errCode => `Error while starting server instance. Error code: ${errCode}`,
    shutdown: 'Signal received: Shutting down...',
    invalidPort: 'Invalid port format'
  }
};

module.exports = errors;