// @flow

import crypto from 'crypto';
import moment from 'moment';

const utils = {
  isPortValid(val: any) {
    const port = parseInt(val, 10);

    return port >= 0;
  },

  addSecondsToDate(seconds: number) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  },

  isTokenExpired(token: string) {
    const tokenAsDate = new Date(token);
    return tokenAsDate.getTime() < new Date().getTime();
  },

  changeCardName(name: string, prefix: string, separator: string, counter: number) {
    const cardPrefix = `${prefix}${separator}${counter.toString()}`;
    return `${cardPrefix}: ${name}`;
  },

  verifyTrelloWebhookRequest(
    body: Object,
    trelloWebhookHeader: string,
    secret: string,
    callbackURL: string,
  ) {
    const base64Digest = (s) => {
      return crypto.createHmac('sha1', secret).update(s).digest('base64');
    };

    const bodyAsString = JSON.stringify(body);
    const content = `${bodyAsString}${callbackURL}`;

    const doubleHash = base64Digest(base64Digest(content));
    const headerHash = base64Digest(trelloWebhookHeader);

    return doubleHash === headerHash;
  },

  createEntriesArr(entriesArr: Array<Object> = []) {
    const reducer = (arr, day) => arr.reduce((acc, { _id, entries }) => {
      const entryDateAsUTC = moment(_id).utc();
      return acc + (entryDateAsUTC.isSameOrAfter(moment(day)) && entryDateAsUTC.isBefore(moment(day).add(24, 'hours')) ? entries : 0);
    }, 0);

    const generateTimeline = (len = 7, date) => {
      const arr = new Array(len).fill();
      return arr.map((_, idx) => moment(date).subtract(idx * 24, 'hours'));
    };

    const firstDate = moment().startOf('day');
    const timeline = generateTimeline(7, firstDate);
    const entries = timeline.map(entry => reducer(entriesArr, entry));

    return timeline.map((timeEntry, idx) => ({ day: timeEntry, cards: entries[idx] })).reverse();
  },
};

module.exports = utils;
