// @flow

import request from 'request';
import dotenv from 'dotenv';
import { OAuth } from 'oauth';
import Promise from 'bluebird';

import User from '../models/user';

dotenv.config();

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
  const appDomain = process.env.APP_DOMAIN || '';
  const loginCallback = process.env.TRELLO_CALLBACK || '';

  self.oauth = new OAuth(
    requestURL,
    accessURL,
    key,
    secret,
    '1.0A',
    `${appDomain}${loginCallback}`,
    'HMAC-SHA1'
  );
};


Trello.prototype.login = function login() {
  const self = this;

  return new Promise((resolve, reject) => {
    self.oauth.getOAuthRequestToken((err, token, tokenSecret, results) => {
      if (err) reject(err);

      resolve({
        token,
        tokenSecret,
        loginURL: `${authorizeURL}?oauth_token=${token}&name=${encodeURIComponent(appName)}&scope=read%2Cwrite&expiration=never`
      });
    });
  });
};


Trello.prototype.callback = function callback(token: string, tokenSecret: string, verifier: string) {

  const self = this;

  return new Promise((resolve, reject) => {
    self.oauth.getOAuthAccessToken(
      token,
      tokenSecret,
      verifier,
      (err, accessToken, accessTokenSecret, results) => {
        if (err) reject(err);

        resolve({ accessToken, accessTokenSecret });
    });
  });
};


Trello.prototype.getMyBoards = function getMyBoards(accessToken: string, accessTokenSecret: string) {
  const self = this;

  return new Promise((resolve, reject) => {
    self.oauth.getProtectedResource(
      'https://api.trello.com/1/members/me/boards',
      'GET',
      accessToken,
      accessTokenSecret,
      (err, data, response) => {
        if (err) reject(err);

        const boards = JSON.parse(data);
        const slimBoards = boards.map(board => {
          const { id, name, url } = board;
          return { id, name, url };
        });

        resolve(slimBoards);
    });
  });
};


Trello.prototype.getBoard = function getBoard(boardID: string, accessToken: string, accessTokenSecret: string) {
  const self = this;

  return new Promise((resolve, reject) => {
    self.oauth.getProtectedResource(
        `https://api.trello.com/1/boards/${boardID}`,
        'GET',
      accessToken,
      accessTokenSecret,
      (err, data, response) => {
        if (err) reject(err);

        resolve(JSON.parse(data));
    });
  });
};


Trello.prototype.createWebhook = function(userToken: string, boardID: string) {
  const callbackURL = `${process.env.APP_DOMAIN || ''}${process.env.TRELLO_WEBHOOK_CALLBACK || ''}`;
  const appKey = process.env.TRELLO_KEY || '';

  const options = {
    method: 'POST',
    url: `https://api.trello.com/1/tokens/${userToken}/webhooks/?key=${appKey}&callbackURL=${callbackURL}&idModel=${boardID}`
  };

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) reject(err);

      if (response.statusCode !== 200) {
        return reject(`An error occurred while setting up the webhook for: ${boardID}`);
      }

      const { id } = JSON.parse(body);

      resolve(id);
    });
  });
}


Trello.prototype.updateCard = function(userToken: string, cardID: string, newName: string) {
  const appKey = process.env.TRELLO_KEY || '';
  const _newName = encodeURIComponent(newName);

  const options = {
    method: 'PUT',
    url: `https://api.trello.com/1/cards/${cardID}/?key=${appKey}&token=${userToken}&name=${_newName}`
  };

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) reject(err);

      if (response.statusCode !== 200) {
        return reject(`An error occurred while update card name: ${cardID}`);
      }

      resolve();
    });
  });
}


Trello.prototype.deleteWebhook = function(userToken: string, webhookID: string) {
  const appKey = process.env.TRELLO_KEY || '';

  const options = {
    method: 'DELETE',
    url: `https://api.trello.com/1/webhooks/${webhookID}?key=${appKey}&token=${userToken}`
  };

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) reject(err);

      if (response.statusCode !== 200) {
        return reject(`An error occurred while deleting hook: ${webhookID}`);
      }

      resolve();
    });
  });
}


module.exports = Trello;
