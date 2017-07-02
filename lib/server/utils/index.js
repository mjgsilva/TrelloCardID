'use strict';

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

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
  },

  createEntriesArr(entriesArr = []) {
    const reducer = (arr, day) => arr.reduce((acc, { _id, entries }) => {
      const entryDateAsUTC = (0, _moment2.default)(_id).utc();
      return acc + (entryDateAsUTC.isSameOrAfter((0, _moment2.default)(day)) && entryDateAsUTC.isBefore((0, _moment2.default)(day).add(24, 'hours')) ? entries : 0);
    }, 0);

    const generateTimeline = (len = 7, date) => {
      const arr = new Array(len).fill();
      return arr.map((_, idx) => (0, _moment2.default)(date).subtract(idx * 24, 'hours'));
    };

    const firstDate = (0, _moment2.default)().startOf('day');
    const timeline = generateTimeline(7, firstDate);
    const entries = timeline.map(entry => reducer(entriesArr, entry));

    return timeline.map((timeEntry, idx) => ({ day: timeEntry, cards: entries[idx] })).reverse();
  }
};

module.exports = utils;