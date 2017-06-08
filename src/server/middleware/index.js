// @flow

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressWinston from 'express-winston';
import path from 'path';
import winston from 'winston';

import setupAPI from './api/index';


function setupLogger(app: Object): void {
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
      }),
    ],
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true,
  }));
}


function setupUtils(app: Object): void {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
}


function setupErrorHandling(app: Object): void {
  app.use((req, res, next) => {
    const err: any = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
  });
}


function setupMiddleware(app: Object): void {
  setupLogger(app);
  setupUtils(app);
  setupAPI(app);
  setupErrorHandling(app);
}

module.exports = setupMiddleware;
