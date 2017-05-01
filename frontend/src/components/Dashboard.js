import React, { Component } from 'react';

import { isLoggedIn, getUser } from '../utils/AuthService';
import { getBoards } from '../utils/APIHandler';

class Dashboard extends Component {

  render() {
    const { email, name, picture } = getUser();

    return isLoggedIn() ?
           <div>
             <h1>Unlocked - Protected Page</h1>
             <div>
               <p>{name} / {email}</p>
               <img src={picture} />
             </div>
             <button onClick={() => getBoards()}>Fetch</button>
          </div>
           : <div>Protected Page</div>
  }
}

export default Dashboard;
