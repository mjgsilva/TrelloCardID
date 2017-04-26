import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Landing from './components/Landing';

const Root = () => {
  return (
    <div className='container'>
      <Router>
        <Route exact path="/" component={Landing}/>
      </Router>
    </div>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
