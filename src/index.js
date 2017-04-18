import dotenv from 'dotenv';

import server from './server';
import logger from './server/logger';

dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

server()
  .then(authServer => authServer.start(port, host))
  .catch(err => logger.logErrorAndExit(err));
