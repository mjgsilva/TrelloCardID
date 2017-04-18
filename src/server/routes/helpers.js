// @flow

import dotenv from 'dotenv';

dotenv.config();

const helpers = {
  getAuthVars: (): Object => {
    return {
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
    };
  },
};

module.exports = helpers;
