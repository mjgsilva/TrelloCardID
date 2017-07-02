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

var _counter_entry = require('../models/counter_entry');

var _counter_entry2 = _interopRequireDefault(_counter_entry);

var _authzero3 = require('../services/authzero');

var _index = require('../authorization/index');

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get('/', (0, _index.authCheck)(), (req, res) => {
  const { sub: userID } = req.user;

  _authzero2.default.getAccessToken().then(accessToken => (0, _authzero3.getUserInfo)(accessToken, userID)).then(email => _user2.default.getUserID(email)).then(_id => _bluebird2.default.join(_access_token2.default.getAccessToken(_id), _counter2.default.getCounters(_id), _counter_entry2.default.getStats(_id), _counter_entry2.default.getRecentEntries(_id))).then(([{ accessToken }, counters, stats, recentEntries]) => res.send({
    accessToken,
    counters,
    stats: _utils2.default.createEntriesArr(stats),
    recentEntries
  })).catch(() => {
    res.sendStatus(500);
  });
});

module.exports = router;