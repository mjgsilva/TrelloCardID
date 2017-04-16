// @flow

import express from 'express';
import Promise from 'bluebird';

import Server from './server';

function init(): Promise {
  const app = express();
  const server = new Server(app);
  return Promise.resolve(server);
}

module.exports = init;
