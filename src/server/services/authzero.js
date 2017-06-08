import request from 'request';
import dotenv from 'dotenv';

dotenv.config();


export const getAccessToken = () => {
  const requestBody = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_CLIENT_AUDIENCE,
    grant_type: 'client_credentials'
  };

  const options = {
    method: 'POST',
    url: process.env.AUTH0_CLIENT_TOKEN_URI,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requestBody)
  };

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) reject(err);

      const { error, access_token, expires_in } = JSON.parse(body);

      if (error) reject(error);

      resolve({ accessToken: access_token, expiresIn: expires_in });
    });
  });
}


export const getUserInfo = (accessToken, userID) => {
  const options = {
    method: 'GET',
    url: `${process.env.AUTH0_CLIENT_AUDIENCE}users/${userID}`,
    headers: { authorization: `Bearer ${accessToken}` }
  };

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) reject(err);

      const { statusCode, error, email } = JSON.parse(body);
      if (statusCode === 404 || statusCode === 401) reject(error);

      resolve(email);
    });
  });
}
