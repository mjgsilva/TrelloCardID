import { Component } from 'react';

import { callbackHandler } from '../utils/AuthService';

class Callback extends Component {
  componentDidMount() {
    callbackHandler();
  }

  render() {
    return null;
  }
}

export default Callback;
