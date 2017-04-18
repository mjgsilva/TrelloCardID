'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passportAuth = require('passport-auth0');

var _passportAuth2 = _interopRequireDefault(_passportAuth);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _index = require('./api/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

function setupPassport(app) {
  const strategy = new _passportAuth2.default({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  }, (_, __, ___, profile, done) => {
    return done(null, profile);
  });

  _passport2.default.use(strategy);
  _passport2.default.serializeUser((user, done) => done(null, user));
  _passport2.default.deserializeUser((user, done) => done(null, user));
  app.use(_passport2.default.initialize());
  app.use(_passport2.default.session());
}

function setupViews(app) {
  app.set('views', _path2.default.join(__dirname, '../views'));
  app.set('view engine', 'jade');
}

function setupLogger(app) {
  app.use(_expressWinston2.default.logger({
    transports: [new _winston2.default.transports.Console({
      colorize: true
    })],
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true
  }));
}

function setupUtils(app) {
  app.use(_bodyParser2.default.json());
  app.use(_bodyParser2.default.urlencoded({ extended: false }));
  app.use((0, _cookieParser2.default)());
  app.use((0, _expressSession2.default)({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true
  }));
  app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));
}

function setupErrorHandling(app) {
  app.use((req, res, next) => {
    const err = new Error('Not Found');
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

function setupMiddleware(app) {
  setupPassport(app);
  setupViews(app);
  setupLogger(app);
  (0, _index2.default)(app);
  setupUtils(app);
  setupErrorHandling(app);
}

module.exports = setupMiddleware;