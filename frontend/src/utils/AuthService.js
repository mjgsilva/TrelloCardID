import decode from 'jwt-decode';
import auth0 from 'auth0-js';

const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const SCOPE = 'read:boards openid email profile';

var auth = new auth0.WebAuth({
  clientID: process.env.REACT_APP_CLIENT_ID,
  domain: process.env.REACT_APP_CLIENT_DOMAIN
});

export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: `${process.env.REACT_APP_MY_DOMAIN}${process.env
      .REACT_APP_REDIRECT}`,
    audience: process.env.REACT_APP_AUDIENCE,
    scope: SCOPE
  });
}

export function logout() {
  clearIdToken();
  clearAccessToken();
  redirectToRoot();
}

export function callbackHandler() {
  setAccessToken();
  setIdToken();
  redirectToRoot();
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function redirectToRoot() {
  window.location = '/';
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
  let accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
  let idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
  const accessToken = getAccessToken();
  return !!accessToken && !isTokenExpired(accessToken);
}

export function getUser() {
  const idToken = getIdToken();
  const { email, name, picture } = idToken && decode(idToken);

  return {
    email,
    name,
    picture
  };
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
