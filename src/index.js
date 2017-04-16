import server from './server';
import errors from './server/errors';

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

server()
  .then(authServer => authServer.start(port, host))
  .catch(err => errors.logErrorAndExit(err));
