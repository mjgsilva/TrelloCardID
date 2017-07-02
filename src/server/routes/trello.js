// @flow

import express from 'express';
import Promise from 'bluebird';

import logger from '../logger';
import Trello from '../services/trello';
import Authzero from '../models/authzero';
import User from '../models/user';
import Token from '../models/token';
import Counter from '../models/counter';
import Entry from '../models/counter_entry';
import AccessToken from '../models/access_token';
import { authCheck } from '../authorization/index';
import { getUserInfo } from '../services/authzero';
import { verifyTrelloWebhookRequest, changeCardName } from '../utils';

const router = express.Router();
const trello = new Trello();
trello.setup();

router.get('/token', authCheck(), (req, res) => {
  const { sub: userID } = req.user;

  Authzero
  .getAccessToken()
  .then(accessToken => getUserInfo(accessToken, userID))
  .then((email) => {
    return trello.login()
      .then(({ token, tokenSecret, loginURL }) => {
        User.getUserID(email)
          .then((user) => {
            if (!user) {
              const newUser = new User({ email });

              newUser.save()
                .then(({ _id }) => {
                  const newToken = new Token({ token, tokenSecret, _owner: _id });
                  newToken.save().catch(err => Promise.reject(err));
                })
                .catch(err => Promise.reject(err));
            } else {
              const newToken = new Token({ token, tokenSecret, _owner: user._id });
              newToken.save().catch(err => Promise.reject(err));
            }
          })
          .catch(err => Promise.reject(err));

        return Promise.resolve(loginURL);
      })
      .catch(err => Promise.reject(err));
  })
  .then((loginURL) => { res.send(loginURL); })
  .catch(() => { res.sendStatus(500); });
});


router.get('/callback', (req, res) => {
  const {
    oauth_token: token,
    oauth_verifier: verifier,
  } = req.query;

  Token.getTokenSecret(token)
    .then((user) => {
      if (!user) {
        return Promise.reject('No token found');
      }

      const { _owner, tokenSecret } = user;

      return trello.callback(token, tokenSecret, verifier)
        .then(({ accessToken, accessTokenSecret }) => {
          const _accessToken = new AccessToken({ accessToken, accessTokenSecret, _owner });
          return _accessToken.save().catch(err => Promise.reject(err));
        })
        .catch(err => Promise.reject(err));
    })
    .then(() => { res.redirect('/'); })
    .catch(() => { res.sendStatus(500); });
});


router.get('/me', authCheck(), (req, res) => {
  const { sub: userID } = req.user;

  Authzero
  .getAccessToken()
  .then(accessToken => getUserInfo(accessToken, userID))
  .then(email => User.getUserID(email))
  .then(_id => AccessToken.getAccessToken(_id))
  .then(({ accessToken, accessTokenSecret }) => trello.getMyBoards(accessToken, accessTokenSecret))
  .then((boards) => { res.send(boards); })
  .catch((err) => {
    logger.logError(new Error(err));
    res.sendStatus(500);
  });
});


router.post('/counter', authCheck(), (req, res) => {
  const {
    user: { sub: userID },
    body: { boardID },
  } = req;

  let _owner;
  let _accessToken;
  let _counterID;

  Authzero.getAccessToken()
  .then(accessToken => getUserInfo(accessToken, userID))
  .then(email => User.getUserID(email))
  .then((_id) => {
    _owner = _id;
    return AccessToken.getAccessToken(_id);
  })
  .then(({ accessToken, accessTokenSecret }) => {
    _accessToken = accessToken;
    return trello.getBoard(boardID, accessToken, accessTokenSecret);
  })
  .then((board) => {
    const { counter, prefix, separator } = req.body;
    const { id: boardTrelloID, name: boardName } = board;

    const _counter = new Counter({ prefix, counter, separator, boardTrelloID, boardName, _owner });
    return _counter.save().catch(err => Promise.reject(err));
  })
  .then(({ _id }) => {
    _counterID = _id;
    return trello.createWebhook(_accessToken, boardID);
  })
  .then(webhookID => Counter.updateWebhook(_counterID, webhookID))
  .then(() => res.sendStatus(200))
  .catch((err) => {
    logger.logError(new Error(err));
    res.sendStatus(500);
  });
});


router.delete('/counter/:boardID', authCheck(), (req, res) => {
  const {
    user: { sub: userID },
    params: { boardID },
  } = req;

  let _counterID;
  let _webhookID;

  Authzero.getAccessToken()
  .then(accessToken => getUserInfo(accessToken, userID))
  .then(email => User.getUserID(email))
  .then((id) => {
    return Counter.getCounterOwner(boardID, id)
    .then(({ webhookID, _id }) => {
      if (!webhookID) return Promise.reject('Invalid access');
      _counterID = _id;
      _webhookID = webhookID;
      return Promise.resolve(id);
    })
    .catch(err => Promise.reject(err));
  })
  .then(ownerID => AccessToken.getAccessToken(ownerID))
  .then(({ accessToken }) => trello.deleteWebhook(accessToken, _webhookID))
  .then(() => Counter.deleteCounter(_counterID))
  .then(() => res.sendStatus(200))
  .catch((err) => {
    logger.logError(new Error(err));
    res.sendStatus(500);
  });
});


router.head('/whcallback', (req, res) => {
  res.sendStatus(200);
});


router.post('/whcallback', (req, res) => {
  const callbackURL = `${process.env.APP_DOMAIN || ''}${process.env.TRELLO_WEBHOOK_CALLBACK || ''}`;
  const appKey = process.env.TRELLO_OAUTH_SECRET || '';

  if (!verifyTrelloWebhookRequest(req.body, req.headers['x-trello-webhook'], appKey, callbackURL)) {
    return res.sendStatus(500);
  }

  const { action, model } = req.body;

  if (action.type === 'createCard') {
    const { id, name, idShort } = action.data.card;

    let _counterID;
    let _counter;
    let _prefix;
    let _separator;
    let _owner;

    Counter.getCounter(model.id)
    .then(({ _id, counter, prefix, separator, _owner: owner }) => {
      _counterID = _id;
      _counter = counter;
      _prefix = prefix;
      _separator = separator;
      _owner = owner;

      const _entry = new Entry({ id, shortID: idShort, _counter: _id });
      return _entry.save().catch(err => Promise.reject(err));
    })
    .then(() => AccessToken.getAccessToken(_owner))
    .then(({ accessToken }) => {
      const newCardName = changeCardName(name, _prefix, _separator, _counter);
      return trello.updateCard(accessToken, id, newCardName);
    })
    .then(() => Counter.updateCounter(_counterID, _counter + 1))
    .catch((err) => { logger.logError(new Error(err)); });
  }

  return res.sendStatus(200);
});

module.exports = router;
