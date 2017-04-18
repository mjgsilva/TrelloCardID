// @flow

import dotenv from 'dotenv';

dotenv.config();

const helpers = {
  getDBVars: (): Object => {
    return {
      MONGOOSE_DOMAIN: process.env.MONGOOSE_DOMAIN,
      MONGOOSE_USER: process.env.MONGOOSE_USER,
      MONGOOSE_PWD: process.env.MONGOOSE_PWD,
      MONGOOSE_PORT: process.env.MONGOOSE_PORT,
      MONGOOSE_DB: process.env.MONGOOSE_DB,
    };
  },
};

module.exports = helpers;
