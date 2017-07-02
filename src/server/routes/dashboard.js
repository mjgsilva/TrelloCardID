// @flow

import express from 'express';
import Promise from 'bluebird';

import Authzero from '../models/authzero';
import User from '../models/user';
import AccessToken from '../models/access_token';
import Counter from '../models/counter';
import Entry from '../models/counter_entry';
import { getUserInfo } from '../services/authzero';

import { authCheck } from '../authorization/index';
import utils from '../utils';

const router = express.Router();

router.get('/', authCheck(), (req, res) => {
  const { sub: userID } = req.user;

  Authzero
  .getAccessToken()
  .then(accessToken => getUserInfo(accessToken, userID))
  .then(email => User.getUserID(email))
  .then(_id => Promise.join(
    AccessToken.getAccessToken(_id),
    Counter.getCounters(_id),
    Entry.getStats(_id),
    Entry.getRecentEntries(_id),
  ))
  .then(([{ accessToken }, counters, stats, recentEntries]) => res.send(
    {
      accessToken,
      counters,
      stats: utils.createEntriesArr(stats),
      recentEntries,
    },
  ))
  .catch(() => { res.sendStatus(500); });
});

module.exports = router;
