// @flow

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
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
