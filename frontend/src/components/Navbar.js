import React from 'react';

import { getTrelloToken } from '../utils/APIHandler';
import { logout } from '../utils/AuthService';

const Navbar = ({ name, email, pictureUrl, apiKey }) => {

  const apiKeyTag = apiKey ? 'verified' : 'nokey';

  return (
    <nav className='navbar'>
      <div className='api-key-area'>
        <div className='api-key-label'>Your Trello API Key: </div>
        {
          apiKey &&
          <div className='api-key'>{`${apiKey.substr(0, 20)}...`}</div>
        }
        <div className={`api-tag api-${apiKeyTag}`}
          onClick={() => {
            if (!apiKey) {
              getTrelloToken()
              .then(res => { window.location = res; });
            }
          }}/>
      </div>
      <ul>
        <li className='avatar-wrapper'>
          <span>{name}</span>
          <img alt={`${name}'s avatar`} className="post-avatar" src={pictureUrl} onClick={logout} />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
