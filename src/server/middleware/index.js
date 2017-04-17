// @flow

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressWinston from 'express-winston';
import path from 'path';
import winston from 'winston';

import setupAPI from './api';

function setupViews(app: Object): void {
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'jade');
}


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
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));
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
  setupViews(app);
  setupLogger(app);
  setupAPI(app);
  setupUtils(app);
  setupErrorHandling(app);
}

module.exports = setupMiddleware;
