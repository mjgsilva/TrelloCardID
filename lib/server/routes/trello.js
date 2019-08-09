'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _trello = require('../services/trello');

var _trello2 = _interopRequireDefault(_trello);

var _authzero = require('../models/authzero');

var _authzero2 = _interopRequireDefault(_authzero);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _token = require('../models/token');

var _token2 = _interopRequireDefault(_token);

var _counter2 = require('../models/counter');

var _counter3 = _interopRequireDefault(_counter2);

var _counter_entry = require('../models/counter_entry');

var _counter_entry2 = _interopRequireDefault(_counter_entry);

var _access_token = require('../models/access_token');

var _access_token2 = _interopRequireDefault(_access_token);

var _index = require('../authorization/index');

var _authzero3 = require('../services/authzero');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

const trello = new _trello2.default();
trello.setup();

router.get('/token', (0, _index.authCheck)(), (req, res) => {
  const { sub: userID } = req.user;

  _authzero2.default.getAccessToken().then(accessToken => (0, _authzero3.getUserInfo)(accessToken, userID)).then(email => {
    return trello.login().then(({ token, tokenSecret, loginURL }) => {
      _user2.default.getUserID(email).then(user => {
        if (!user) {
          const newUser = new _user2.default({ email });

          newUser.save().then(({ _id }) => {
            const newToken = new _token2.default({ token, tokenSecret, _owner: _id });
            newToken.save().catch(err => _bluebird2.default.reject(err));
          }).catch(err => _bluebird2.default.reject(err));
        } else {
          const newToken = new _token2.default({ token, tokenSecret, _owner: user._id });
          newToken.save().catch(err => _bluebird2.default.reject(err));
        }
      }).catch(err => _bluebird2.default.reject(err));

      return _bluebird2.default.resolve(loginURL);
    }).catch(err => _bluebird2.default.reject(err));
  }).then(loginURL => {
    res.send(loginURL);
  }).catch(() => {
    res.sendStatus(500);
  });
});

router.get('/callback', (req, res) => {
  const {
    oauth_token: token,
    oauth_verifier: verifier
  } = req.query;

  _token2.default.getTokenSecret(token).then(user => {
    if (!user) {
      return _bluebird2.default.reject('No token found');
    }

    const { _owner, tokenSecret } = user;

    return trello.callback(token, tokenSecret, verifier).then(({ accessToken, accessTokenSecret }) => {
      const _accessToken = new _access_token2.default({ accessToken, accessTokenSecret, _owner });
      return _accessToken.save().catch(err => _bluebird2.default.reject(err));
    }).catch(err => _bluebird2.default.reject(err));
  }).then(() => {
    res.redirect('/');
  }).catch(() => {
    res.sendStatus(500);
  });
});

router.get('/me', (0, _index.authCheck)(), (req, res) => {
  const { sub: userID } = req.user;

  _authzero2.default.getAccessToken().then(accessToken => (0, _authzero3.getUserInfo)(accessToken, userID)).then(email => _user2.default.getUserID(email)).then(_id => _access_token2.default.getAccessToken(_id)).then(({ accessToken, accessTokenSecret }) => trello.getMyBoards(accessToken, accessTokenSecret)).then(boards => {
    res.send(boards);
  }).catch(err => {
    res.sendStatus(500);
  });
});

router.post('/counter', (0, _index.authCheck)(), (req, res) => {
  const {
    user: { sub: userID },
    body: { boardID }
  } = req;

  let _owner;
  let _accessToken;
  let _counterID;

  _authzero2.default.getAccessToken().then(accessToken => (0, _authzero3.getUserInfo)(accessToken, userID)).then(email => _user2.default.getUserID(email)).then(_id => {
    _owner = _id;
    return _access_token2.default.getAccessToken(_id);
  }).then(({ accessToken, accessTokenSecret }) => {
    _accessToken = accessToken;
    return trello.getBoard(boardID, accessToken, accessTokenSecret);
  }).then(board => {
    const { counter, prefix, separator } = req.body;
    const { id: boardTrelloID, name: boardName } = board;

    const _counter = new _counter3.default({ prefix, counter, separator, boardTrelloID, boardName, _owner });
    return _counter.save().catch(err => _bluebird2.default.reject(err));
  }).then(({ _id }) => {
    _counterID = _id;
    return trello.createWebhook(_accessToken, boardID);
  }).then(webhookID => _counter3.default.updateWebhook(_counterID, webhookID)).then(() => res.sendStatus(200)).catch(err => {
    _logger2.default.logError(new Error(err));
    res.sendStatus(500);
  });
});

router.delete('/counter/:boardID', (0, _index.authCheck)(), (req, res) => {
  const {
    user: { sub: userID },
    params: { boardID }
  } = req;

  let _counterID;
  let _webhookID;

  _authzero2.default.getAccessToken().then(accessToken => (0, _authzero3.getUserInfo)(accessToken, userID)).then(email => _user2.default.getUserID(email)).then(id => {
    return _counter3.default.getCounterOwner(boardID, id).then(({ webhookID, _id }) => {
      if (!webhookID) return _bluebird2.default.reject('Invalid access');
      _counterID = _id;
      _webhookID = webhookID;
      return _bluebird2.default.resolve(id);
    }).catch(err => _bluebird2.default.reject(err));
  }).then(ownerID => _access_token2.default.getAccessToken(ownerID)).then(({ accessToken }) => trello.deleteWebhook(accessToken, _webhookID)).then(() => _counter3.default.deleteCounter(_counterID)).then(() => res.sendStatus(200)).catch(err => {
    _logger2.default.logError(new Error(err));
    res.sendStatus(500);
  });
});

router.head('/whcallback', (req, res) => {
  res.sendStatus(200);
});

router.post('/whcallback', (req, res) => {
  const callbackURL = `${process.env.APP_DOMAIN || ''}${process.env.TRELLO_WEBHOOK_CALLBACK || ''}`;
  const appKey = process.env.TRELLO_OAUTH_SECRET || '';

  if (!(0, _utils.verifyTrelloWebhookRequest)(req.body, req.headers['x-trello-webhook'], appKey, callbackURL)) {
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

    _counter3.default.getCounter(model.id).then(({ _id, counter, prefix, separator, _owner: owner }) => {
      _counterID = _id;
      _counter = counter;
      _prefix = prefix;
      _separator = separator;
      _owner = owner;

      const _entry = new _counter_entry2.default({ id, shortID: idShort, _counter: _id });
      return _entry.save().catch(err => _bluebird2.default.reject(err));
    }).then(() => _access_token2.default.getAccessToken(_owner)).then(({ accessToken }) => {
      const newCardName = (0, _utils.changeCardName)(name, _prefix, _separator, _counter);
      return trello.updateCard(accessToken, id, newCardName);
    }).then(() => _counter3.default.updateCounter(_counterID, _counter + 1)).catch(err => {
      _logger2.default.logError(new Error(err));
    });
  }

  return res.sendStatus(200);
});

module.exports = router;