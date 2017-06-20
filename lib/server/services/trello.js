'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _oauth = require('oauth');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const appName = 'Trello Card ID';
const prefix = 'https://trello.com/1';
const requestURL = `${prefix}/OAuthGetRequestToken`;
const accessURL = `${prefix}/OAuthGetAccessToken`;
const authorizeURL = `${prefix}/OAuthAuthorizeToken`;

function Trello() {
  this.oauth = null;
}

Trello.prototype.setup = function setup() {
  const self = this;

  const key = process.env.TRELLO_KEY || '';
  const secret = process.env.TRELLO_OAUTH_SECRET || '';
  const appDomain = process.env.MY_DOMAIN || '';
  const loginCallback = process.env.TRELLO_CALLBACK || '';

  self.oauth = new _oauth.OAuth(requestURL, accessURL, key, secret, '1.0A', `${appDomain}${loginCallback}`, 'HMAC-SHA1');
};

Trello.prototype.login = function login() {
  const self = this;

  return new _bluebird2.default((resolve, reject) => {
    self.oauth.getOAuthRequestToken((err, token, tokenSecret) => {
      if (err) return reject(err);

      return resolve({
        token,
        tokenSecret,
        loginURL: `${authorizeURL}?oauth_token=${token}&name=${encodeURIComponent(appName)}&scope=read%2Cwrite&expiration=never`
      });
    });
  });
};

Trello.prototype.callback = function callback(token, tokenSecret, verifier) {
  const self = this;

  return new _bluebird2.default((resolve, reject) => {
    self.oauth.getOAuthAccessToken(token, tokenSecret, verifier, (err, accessToken, accessTokenSecret) => {
      if (err) return reject(err);

      return resolve({ accessToken, accessTokenSecret });
    });
  });
};

Trello.prototype.getMyBoards = function getMyBoards(accessToken, accessTokenSecret) {
  const self = this;

  return new _bluebird2.default((resolve, reject) => {
    self.oauth.getProtectedResource('https://api.trello.com/1/members/me/boards', 'GET', accessToken, accessTokenSecret, (err, data) => {
      if (err) return reject(err);

      const boards = JSON.parse(data);
      const slimBoards = boards.map(board => {
        const { id, name, url } = board;
        return { id, name, url };
      });

      return resolve(slimBoards);
    });
  });
};

Trello.prototype.getBoard = function getBoard(boardID, accessToken, accessTokenSecret) {
  const self = this;

  return new _bluebird2.default((resolve, reject) => {
    self.oauth.getProtectedResource(`https://api.trello.com/1/boards/${boardID}`, 'GET', accessToken, accessTokenSecret, (err, data) => {
      if (err) return reject(err);

      return resolve(JSON.parse(data));
    });
  });
};

Trello.prototype.createWebhook = function createWebhook(userToken, boardID) {
  const callbackURL = `${process.env.APP_DOMAIN || ''}${process.env.TRELLO_WEBHOOK_CALLBACK || ''}`;
  const appKey = process.env.TRELLO_KEY || '';

  const options = {
    method: 'POST',
    url: `https://api.trello.com/1/tokens/${userToken}/webhooks/?key=${appKey}&callbackURL=${callbackURL}&idModel=${boardID}`
  };

  return new _bluebird2.default((resolve, reject) => {
    (0, _request2.default)(options, (err, response, body) => {
      if (err) return reject(err);

      if (response.statusCode !== 200) {
        return reject(`An error occurred while setting up the webhook for: ${boardID}`);
      }

      const { id } = JSON.parse(body);

      return resolve(id);
    });
  });
};

Trello.prototype.updateCard = function updateCard(userToken, cardID, newName) {
  const appKey = process.env.TRELLO_KEY || '';
  const encodedNewName = encodeURIComponent(newName);

  const options = {
    method: 'PUT',
    url: `https://api.trello.com/1/cards/${cardID}/?key=${appKey}&token=${userToken}&name=${encodedNewName}`
  };

  _logger2.default.logError(new Error(cardID));
  _logger2.default.logError(new Error(appKey));
  _logger2.default.logError(new Error(userToken));
  _logger2.default.logError(new Error(encodedNewName));

  return new _bluebird2.default((resolve, reject) => {
    (0, _request2.default)(options, (err, response) => {
      if (err) return reject(err);

      if (response.statusCode !== 200) {
        return reject(`An error occurred while update card name: ${cardID}`);
      }

      return resolve();
    });
  });
};

Trello.prototype.deleteWebhook = function deleteWebhook(userToken, webhookID) {
  const appKey = process.env.TRELLO_KEY || '';

  const options = {
    method: 'DELETE',
    url: `https://api.trello.com/1/webhooks/${webhookID}?key=${appKey}&token=${userToken}`
  };

  return new _bluebird2.default((resolve, reject) => {
    (0, _request2.default)(options, (err, response) => {
      if (err) return reject(err);

      if (response.statusCode !== 200) {
        return reject(`An error occurred while deleting hook: ${webhookID}`);
      }

      return resolve();
    });
  });
};

module.exports = Trello;