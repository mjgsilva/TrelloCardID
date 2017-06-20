'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authCheck = undefined;

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _jwksRsa = require('jwks-rsa');

var _jwksRsa2 = _interopRequireDefault(_jwksRsa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const jwtHandler = (0, _expressJwt2.default)({
  secret: _jwksRsa2.default.expressJwtSecret({
    cache: false,
    rateLimit: true,
    jwksRequestsPerMinute: 15,
    jwksUri: process.env.AUTH0_URI
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256']
});

/*eslint-disable */
const authCheck = exports.authCheck = () => jwtHandler;
/*eslint-enable */