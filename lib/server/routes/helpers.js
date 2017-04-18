'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const helpers = {
  getAuthVars: () => {
    return {
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
    };
  }
};

module.exports = helpers;