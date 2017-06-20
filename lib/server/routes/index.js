'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

function staticFiles(res) {
  res.sendFile(_path2.default.resolve(__dirname, '..', 'public', 'index.html'));
}

function handleRes(res) {
  if (process.env.NODE_ENV === 'production') {
    staticFiles(res);
  } else {
    res.sendStatus(200);
  }
}

router.get('/', (req, res) => {
  handleRes(res);
});

router.get('/callback', (req, res) => {
  handleRes(res);
});

router.get('/dashboard', (req, res) => {
  handleRes(res);
});

module.exports = router;