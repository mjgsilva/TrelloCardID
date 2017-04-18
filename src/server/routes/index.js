// @flow

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Trello Card ID' });
});

module.exports = router;
