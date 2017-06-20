'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _authzero = require('../models/authzero');

var _authzero2 = _interopRequireDefault(_authzero);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _access_token = require('../models/access_token');

var _access_token2 = _interopRequireDefault(_access_token);

var _counter = require('../models/counter');

var _counter2 = _interopRequireDefault(_counter);

var _authzero3 = require('../services/authzero');

var _index = require('../authorization/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get('/', (0, _index.authCheck)(), (req, res) => {
  const { sub: userID } = req.user;

  _authzero2.default.getAccessToken().then(accessToken => (0, _authzero3.getUserInfo)(accessToken, userID)).then(email => _user2.default.getUserID(email)).then(_id => _bluebird2.default.join(_access_token2.default.getAccessToken(_id), _counter2.default.getCounters(_id))).then(([{ accessToken }, counters]) => res.send({ accessToken, counters })).catch(() => {
    res.sendStatus(500);
  });
});

module.exports = router;