// @flow

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import expressWinston from 'express-winston';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import Auth0Strategy from 'passport-auth0';
import winston from 'winston';

import setupAPI from './api/index';

dotenv.config();


function setupPassport(app: Object): void {
  const strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  }, (_, __, ___, profile, done) => {
    return done(null, profile);
  });

  passport.use(strategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  app.use(passport.initialize());
  app.use(passport.session());
}


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
  app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true
  }));
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
  setupPassport(app);
  setupViews(app);
  setupLogger(app);
  setupAPI(app);
  setupUtils(app);
  setupErrorHandling(app);
}

module.exports = setupMiddleware;
