// @flow

import express from 'express';
import passport from 'passport';

import helpers from './helpers';

const router = express.Router();
const env = helpers.getAuthVars();

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
