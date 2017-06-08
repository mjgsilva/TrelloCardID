import dotenv from 'dotenv';

dotenv.config();

function checkEnvVars() {
  if (!process.env.APP_DOMAIN) throw new Error('FOO missing');
  if (!process.env.AUTH0_URI) throw new Error('FOO missing');
  if (!process.env.AUTH0_AUDIENCE) throw new Error('FOO missing');
  if (!process.env.AUTH0_ISSUER) throw new Error('foo missing');
  if (!process.env.AUTH0_CLIENT_TOKEN_URI) throw new Error('foo missing');

  if (!process.env.AUTH0_CLIENT_ID) throw new Error('foo missing');
  if (!process.env.AUTH0_CLIENT_SECRET) throw new Error('foo missing');
  if (!process.env.AUTH0_CLIENT_AUDIENCE) throw new Error('foo missing');

  if (!process.env.TRELLO_KEY) throw new Error('foo missing');
  if (!process.env.TRELLO_OAUTH_SECRET) throw new Error('foo missing');
  if (!process.env.TRELLO_CALLBACK) throw new Error('foo missing');
  if (!process.env.TRELLO_WEBHOOK_CALLBACK) throw new Error('foo missing');
  if (!process.env.MONGOOSE_ENCRYPT_ENCKEY) throw new Error('foo missing');
  if (!process.env.MONGOOSE_ENCRYPT_SIGKEY) throw new Error('foo missing');
  if (!process.env.MONGOOSE_DOMAIN) throw new Error('foo missing');
  if (!process.env.MONGOOSE_USER) throw new Error('foo missing');
  if (!process.env.MONGOOSE_PWD) throw new Error('foo missing');
  if (!process.env.MONGOOSE_PORT) throw new Error('foo missing');
  if (!process.env.MONGOOSE_DB) throw new Error('foo missing');
}

module.exports = checkEnvVars;
