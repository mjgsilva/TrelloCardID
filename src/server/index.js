// @flow

import express from 'express';
import Promise from 'bluebird';

import setupDB from './db';
import setupMiddleware from './middleware';
import Server from './server';

function init(): Promise<any> {
  const app = express();
  setupDB();
  setupMiddleware(app);
  const server = new Server(app);
  return Promise.resolve(server);
}

module.exports = init;
