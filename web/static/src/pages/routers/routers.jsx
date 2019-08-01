import React from "react";
import { hot, setConfig } from "react-hot-loader";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

import Simulator from "../simulator/simulator.jsx";
import Simple from "../simple/simple.jsx";
import NotFound from "../not-found/not-found.jsx";

class Routers extends React.Component {
  render() {
    return (
      <Router>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/simulator">Simulator</Link>
            </li>
            <li>
              <Link to="/simple">Simple</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/simulator" component={Simulator} />
          <Route path="/simple" component={Simple} />
          <Redirect path="/" to={{pathname: '/simulator'}} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default hot(module)(Routers);
