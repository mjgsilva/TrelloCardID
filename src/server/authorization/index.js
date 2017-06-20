import dotenv from 'dotenv';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

dotenv.config();

const jwtHandler = jwt({
  secret: jwks.expressJwtSecret({
    cache: false,
    rateLimit: true,
    jwksRequestsPerMinute: 15,
    jwksUri: process.env.AUTH0_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256'],
});


/*eslint-disable */
export const authCheck = () => jwtHandler;
/*eslint-enable */
