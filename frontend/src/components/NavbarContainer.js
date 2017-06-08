import React from 'react';

import Navbar from './Navbar';
import { getUser } from '../utils/AuthService';

const NavbarContainer = ({ apiKey }) => {

  const { name, email, picture } = getUser();

  return (
    <Navbar
      name={name}
      email={email}
      pictureUrl={picture}
      apiKey={apiKey}
    />
  );

}

export default NavbarContainer;
