// @flow

import index from '../../routes/index';
import dashboard from '../../routes/dashboard';
import trello from '../../routes/trello';

function setupAPI(app: Object): void {
  app.use('/', index);
  app.use('/me', dashboard);
  app.use('/trello', trello);
}

module.exports = setupAPI;
