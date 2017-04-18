// @flow

import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/',
  passport.authenticate(
    'auth0',
    { failureRedirect: '/index' }
  ),
  (req, res) => {
    res.redirect(req.session.returnTo || '/dashboard');
  }
);

module.exports = router;
