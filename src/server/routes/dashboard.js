// @flow

import express from 'express';
import Promise from 'bluebird';

import Authzero from '../models/authzero';
import User from '../models/user';
import AccessToken from '../models/access_token';
import Counter from '../models/counter';
import { getUserInfo } from '../services/authzero';

import { authCheck } from '../authorization/index';

const router = express.Router();

router.get('/', authCheck(), (req, res) => {
  const { sub: userID } = req.user;

  Authzero
  .getAccessToken()
  .then((accessToken) => getUserInfo(accessToken, userID))
  .then((email) => User.getUserID(email))
  .then((_id) => Promise.join(AccessToken.getAccessToken(_id), Counter.getCounters(_id)))
  .then(([{ accessToken }, counters]) => res.send({ accessToken, counters }))
  .catch((err) => { console.log(err); res.sendStatus(500); });

});

module.exports = router;
