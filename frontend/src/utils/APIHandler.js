import axios from 'axios';

import { getAccessToken } from './AuthService';

const BASE_URL = 'http://localhost:3030';

export function getBoards() {
  const url = `${BASE_URL}/dashboard`;
  return getRequest(url);
}


export function getTrelloToken() {
  const url = `${BASE_URL}/trello/token`;
  return getRequest(url);
}


export function getMyBoards() {
  const url = `${BASE_URL}/trello/me`;
  return getRequest(url);
}


export function createNewCounter(params) {
  const url = `${BASE_URL}/trello/counter`;
  return postRequest(url, params);
}


export function deleteBoard(boardID) {
  const url = `${BASE_URL}/trello/counter/${boardID}`;
  return deleteRequest(url);
}

function getRequest(url) {
  const headers =  {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };

  return axios
         .get(url, headers)
         .then(response => response.data);
}


function postRequest(url, params = {}) {
  const headers =  {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };

  return axios
         .post(url, params, headers)
         .then(response => response.data);
}


function deleteRequest(url) {
  const headers =  {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };

  return axios
         .delete(url, headers)
         .then(response => response.data);
}
