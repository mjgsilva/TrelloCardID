// @flow

import express from 'express';
import connectEnsureLogin from 'connect-ensure-login';

const router = express.Router();
const ensureLoggedIn = connectEnsureLogin.ensureLoggedIn;

router.get('/', ensureLoggedIn('/login'), (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = router;
