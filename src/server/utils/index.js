// @flow

import crypto from 'crypto';

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
    return `${cardPrefix} ${name}`;
  },

  verifyTrelloWebhookRequest(body: Object, trelloWebhookHeader: string, secret: string, callbackURL: string) {
    const base64Digest = (s) => {
      return crypto.createHmac('sha1', secret).update(s).digest('base64');
    };

    const bodyAsString = JSON.stringify(body);
    const content = `${bodyAsString}${callbackURL}`;

    const doubleHash = base64Digest(base64Digest(content));
    const headerHash = base64Digest(trelloWebhookHeader);

    return doubleHash === headerHash;
  }
};

module.exports = utils;
