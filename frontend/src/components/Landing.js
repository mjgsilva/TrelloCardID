import React from 'react';

import { isLoggedIn, login } from '../utils/AuthService';

import logoSVG from '../logo.svg';

class Landing extends React.Component {
  componentWillMount() {
    if (isLoggedIn()) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    return (
      <div className="logo-container">
        <img src={logoSVG} height="200" width="200" alt="logo" />
        <button className="btn login-btn" onClick={login}>
          Login
        </button>
      </div>
    );
  }
}

export default Landing;
