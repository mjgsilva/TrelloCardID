'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

function checkEnvVars() {
  if (!process.env.APP_DOMAIN) throw new Error('APP_DOMAIN missing');
  if (!process.env.AUTH0_URI) throw new Error('AUTH0_URI missing');
  if (!process.env.AUTH0_AUDIENCE) throw new Error('AUTH0_AUDIENCE missing');
  if (!process.env.AUTH0_ISSUER) throw new Error('AUTH0_ISSUER missing');
  if (!process.env.AUTH0_CLIENT_TOKEN_URI) throw new Error('AUTH0_CLIENT_TOKEN_URI missing');

  if (!process.env.AUTH0_CLIENT_ID) throw new Error('AUTH0_CLIENT_ID missing');
  if (!process.env.AUTH0_CLIENT_SECRET) throw new Error('AUTH0_CLIENT_SECRET missing');
  if (!process.env.AUTH0_CLIENT_AUDIENCE) throw new Error('AUTH0_CLIENT_AUDIENCE missing');

  if (!process.env.TRELLO_KEY) throw new Error('TRELLO_KEY missing');
  if (!process.env.TRELLO_OAUTH_SECRET) throw new Error('TRELLO_OAUTH_SECRET missing');
  if (!process.env.TRELLO_CALLBACK) throw new Error('TRELLO_CALLBACK missing');
  if (!process.env.TRELLO_WEBHOOK_CALLBACK) throw new Error('TRELLO_WEBHOOK_CALLBACK missing');
  if (!process.env.MONGOOSE_ENCRYPT_ENCKEY) throw new Error('MONGOOSE_ENCRYPT_ENCKEY missing');
  if (!process.env.MONGOOSE_ENCRYPT_SIGKEY) throw new Error('MONGOOSE_ENCRYPT_SIGKEY missing');
  if (!process.env.MONGOOSE_DOMAIN) throw new Error('MONGOOSE_DOMAIN missing');
  if (!process.env.MONGOOSE_USER) throw new Error('MONGOOSE_USER missing');
  if (!process.env.MONGOOSE_PWD) throw new Error('MONGOOSE_PWD missing');
  if (!process.env.MONGOOSE_PORT) throw new Error('MONGOOSE_PORT missing');
  if (!process.env.MONGOOSE_DB) throw new Error('MONGOOSE_DB missing');
}

module.exports = checkEnvVars;