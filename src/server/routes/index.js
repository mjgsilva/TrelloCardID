// @flow

import express from 'express';
import path from 'path';

const router = express.Router();

function staticFiles(res) {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
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
