// @flow

import express from 'express';
import path from 'path';

const router = express.Router();

//router.get('/', (req, res) => {
//  res.sendStatus(200);
//});
function staticFiles(res) {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
}

router.get('/', (req, res) => {
  //staticFiles(res);
  res.sendStatus(200);
});

router.get('/callback', (req, res) => {
  //staticFiles(res);
  res.sendStatus(200);
});

router.get('/dashboard', (req, res) => {
  //staticFiles(res);
  res.sendStatus(200);
});

module.exports = router;
