'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _index = require('./api/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  app.use((0, _cors2.default)());
}

function setupStaticFiles(app) {
  if (process.env.NODE_ENV === 'production') {
    app.use(_express2.default.static(_path2.default.resolve(__dirname, '..', 'public')));
  }
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
  setupStaticFiles(app);
  setupLogger(app);
  setupUtils(app);
  (0, _index2.default)(app);
  setupErrorHandling(app);
}

module.exports = setupMiddleware;