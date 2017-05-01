import axios from 'axios';

import { getAccessToken } from './AuthService';

const BASE_URL = 'http://localhost:3030';

export function getBoards() {
  const url = `${BASE_URL}/dashboard`;
  return axios.get(url, { headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}
