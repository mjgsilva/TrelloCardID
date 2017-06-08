import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import CallbackHandler from './components/Callback';
import { isLoggedIn } from './utils/AuthService';

import './reset.css';
import './index.css';
import './assets/react-toolbox/theme.css';
import theme from './assets/react-toolbox/theme.js';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';

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
    <ThemeProvider theme={theme}>
    <div className='container'>
      <Router>
        <div>
          <Route exact path="/" component={Landing} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/callback" component={CallbackHandler} />
      </div>
      </Router>
    </div>
  </ThemeProvider>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
