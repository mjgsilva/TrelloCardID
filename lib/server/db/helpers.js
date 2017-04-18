'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const helpers = {
  getDBVars: () => {
    return {
      MONGOOSE_DOMAIN: process.env.MONGOOSE_DOMAIN,
      MONGOOSE_USER: process.env.MONGOOSE_USER,
      MONGOOSE_PWD: process.env.MONGOOSE_PWD,
      MONGOOSE_PORT: process.env.MONGOOSE_PORT,
      MONGOOSE_DB: process.env.MONGOOSE_DB
    };
  }
};

module.exports = helpers;