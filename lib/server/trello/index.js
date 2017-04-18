'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _oauth = require('oauth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const appName = 'Trello Card ID';
const prefix = 'https://trello.com/1';
const requestURL = `${prefix}/OAuthGetRequestToken`;
const accessURL = `${prefix}/OAuthGetAccessToken`;
const authorizeURL = `${prefix}/OAuthAuthorizeToken`;

// You should {"token": "tokenSecret"} pairs in a real application
// Storage should be more permanent (redis would be a good choice)
const oauth_secrets = {};

function Trello() {
  this.oauth = null;
  this.d = null;
}

Trello.prototype.setup = function setup() {
  const self = this;

  const key = process.env.TRELLO_KEY;
  const secret = process.env.TRELLO_OAUTH_SECRET;
  const appDomain = process.env.APP_DOMAIN;
  const loginCallback = `${appDomain}/callback`;

  self.oauth = new _oauth.OAuth(requestURL, accessURL, key, secret, '1.0A', loginCallback, 'HMAC-SHA1');
};

Trello.prototype.login = function login(cb) {
  const self = this;

  self.oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
    console.log(`in getOAuthRequestToken - token: ${token}, tokenSecret: ${tokenSecret}, resultes ${JSON.stringify(results)}, error: ${JSON.stringify(error)}`);
    oauth_secrets[token] = tokenSecret;
    cb(`${authorizeURL}?oauth_token=${token}&name=${appName}&scope=read%2Cwrite`);
  });
};

Trello.prototype.callback = function callback(request, response) {
  const query = url.parse(request.url, true).query;
  const token = query.oauth_token;
  const tokenSecret = oauth_secrets[token];
  const verifier = query.oauth_verifier;
  oauth.getOAuthAccessToken(token, tokenSecret, verifier, function (error, accessToken, accessTokenSecret, results) {
    // In a real app, the accessToken and accessTokenSecret should be stored
    console.log(`in getOAuthAccessToken - accessToken: ${accessToken}, accessTokenSecret: ${accessTokenSecret}, error: ${error}`);
    oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", accessToken, accessTokenSecret, function (error, data, response) {
      // Now we can respond with data to show that we have access to your Trello account via OAuth
      console.log(`in getProtectedResource - accessToken: ${accessToken}, accessTokenSecret: ${accessTokenSecret}`);
      response.send(data);
    });
  });
};

module.exports = Trello;