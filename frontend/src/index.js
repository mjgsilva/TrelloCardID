import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import CallbackHandler from './components/Callback';
import { isLoggedIn } from './utils/AuthService';

import './index.css';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
     isLoggedIn() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const Root = () => {
  return (
    <div className='container'>
      <Router>
        <div>
          <Route exact path="/" component={Landing} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/callback" component={CallbackHandler} />
      </div>
      </Router>
    </div>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
