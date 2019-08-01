import React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import Simulator from '../simulator/simulator.jsx';
import Simple from '../simple/simple.jsx';
import NotFound from '../not-found/not-found.jsx';

class Routers extends React.Component {
  render() {
    return (
      <Router>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/static">static trip path</Link>
            </li>
            <li>
              <Link to="/live">live snail trail</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/live" component={Simulator} />
          <Route path="/static" component={Simple} />
          <Redirect path="/" to={{ pathname: '/static' }} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default hot(module)(Routers);
