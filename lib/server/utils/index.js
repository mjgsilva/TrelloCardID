'use strict';

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const utils = {
  isPortValid(val) {
    const port = parseInt(val, 10);

    return port >= 0;
  },

  addSecondsToDate(seconds) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  },

  isTokenExpired(token) {
    const tokenAsDate = new Date(token);
    return tokenAsDate.getTime() < new Date().getTime();
  },

  changeCardName(name, prefix, separator, counter) {
    const cardPrefix = `${prefix}${separator}${counter.toString()}`;
    return `${cardPrefix}: ${name}`;
  },

  verifyTrelloWebhookRequest(body, trelloWebhookHeader, secret, callbackURL) {
    const base64Digest = s => {
      return _crypto2.default.createHmac('sha1', secret).update(s).digest('base64');
    };

    const bodyAsString = JSON.stringify(body);
    const content = `${bodyAsString}${callbackURL}`;

    const doubleHash = base64Digest(base64Digest(content));
    const headerHash = base64Digest(trelloWebhookHeader);

    return doubleHash === headerHash;
  }
};

module.exports = utils;