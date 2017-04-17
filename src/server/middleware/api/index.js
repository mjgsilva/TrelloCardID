// @flow

import index from '../../routes/index';
import login from '../../routes/login';

function setupAPI(app: Object): void {
  app.use('/', index);
  app.use('/login', login);
}

module.exports = setupAPI;
