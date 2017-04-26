// @flow

import express from 'express';

const router = express.Router();

import dotenv from 'dotenv';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

dotenv.config();

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.AUTH0_URI,
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256'],
  });

router.get('/', authCheck, (req, res) => {
  console.log(authCheck);
  res.render('dashboard', { user: req.user });
});

module.exports = router;
