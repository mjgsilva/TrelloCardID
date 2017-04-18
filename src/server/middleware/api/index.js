// @flow

import index from '../../routes/index';
import login from '../../routes/login';
import logout from '../../routes/logout';
import dashboard from '../../routes/dashboard';
import auth from '../../routes/auth';

function setupAPI(app: Object): void {
  app.use('/', index);
  app.use('/login', login);
  app.use('/logout', logout);
  app.use('/dashboard', dashboard);
  app.use('/auth_callback', auth);
}

module.exports = setupAPI;
