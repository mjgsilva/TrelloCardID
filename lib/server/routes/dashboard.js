'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _connectEnsureLogin = require('connect-ensure-login');

var _connectEnsureLogin2 = _interopRequireDefault(_connectEnsureLogin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();
const ensureLoggedIn = _connectEnsureLogin2.default.ensureLoggedIn;

router.get('/', ensureLoggedIn('/login'), (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = router;