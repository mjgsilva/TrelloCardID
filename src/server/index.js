// @flow

import express from 'express';
import Promise from 'bluebird';

import setupMiddleware from './middleware';
import Server from './server';

function init(): Promise {
  const app = express();
  setupMiddleware(app);
  const server = new Server(app);
  return Promise.resolve(server);
}

module.exports = init;
