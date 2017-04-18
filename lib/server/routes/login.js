'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

const env = _helpers2.default.getAuthVars();

router.get('/', (req, res) => {
  res.render('login', { env });
});

module.exports = router;

/*
import Trello from '../trello';
const trello = new Trello();
trello.setup();

router.get('/', (req, res) => {
  trello.login((loginURL) => {
    res.redirect(loginURL);
  });
});
*/