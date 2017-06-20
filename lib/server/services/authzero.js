'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserInfo = exports.getAccessToken = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const getAccessToken = exports.getAccessToken = () => {
  const requestBody = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_CLIENT_AUDIENCE,
    grant_type: 'client_credentials'
  };

  const options = {
    method: 'POST',
    url: process.env.AUTH0_CLIENT_TOKEN_URI,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requestBody)
  };

  return new Promise((resolve, reject) => {
    (0, _request2.default)(options, (err, response, body) => {
      if (err) return reject(err);

      const { error, access_token, expires_in } = JSON.parse(body);

      if (error) return reject(error);

      return resolve({ accessToken: access_token, expiresIn: expires_in });
    });
  });
};

const getUserInfo = exports.getUserInfo = (accessToken, userID) => {
  const options = {
    method: 'GET',
    url: `${process.env.AUTH0_CLIENT_AUDIENCE}users/${userID}`,
    headers: { authorization: `Bearer ${accessToken}` }
  };

  return new Promise((resolve, reject) => {
    (0, _request2.default)(options, (err, response, body) => {
      if (err) return reject(err);

      const { statusCode, error, email } = JSON.parse(body);
      if (statusCode === 404 || statusCode === 401) return reject(error);

      return resolve(email);
    });
  });
};