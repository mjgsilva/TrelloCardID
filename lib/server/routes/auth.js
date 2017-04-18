'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get('/', _passport2.default.authenticate('auth0', { failureRedirect: '/index' }), (req, res) => {
  res.redirect(req.session.returnTo || '/dashboard');
});

module.exports = router;