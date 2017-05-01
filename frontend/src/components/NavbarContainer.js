import React from 'react';

import Navbar from './Navbar';
import { isLoggedIn, getUser } from '../utils/AuthService';

const { name, email, picture } = getUser();

const NavbarContainer = () => {

  return (
    <Navbar
      isLoggedIn={isLoggedIn()}
      name={name}
      email={email}
      pictureUrl={picture}
    />
  );

}

export default NavbarContainer;
