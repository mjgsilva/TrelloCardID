// @flow

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.sendStatus(200);
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
