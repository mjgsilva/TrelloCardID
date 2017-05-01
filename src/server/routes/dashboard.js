// @flow

import express from 'express';
import dotenv from 'dotenv';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const router = express.Router();

dotenv.config();

// TODO: Move this
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
  res.sendStatus(200);
});

module.exports = router;
