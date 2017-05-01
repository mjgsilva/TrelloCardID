import React from 'react';

import { login, logout } from '../utils/AuthService';

const Navbar = ({ isLoggedIn, name, email, pictureUrl }) => {
  return (
    <nav className='navbar fw'>
      <ul>
        <li className="fr">
          {
            isLoggedIn ?
            <img alt={`${name}'s avatar`} className="post-avatar" src={pictureUrl} onClick={logout} />
            :
            <a href='#' onClick={login}>Login</a>
          }
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
