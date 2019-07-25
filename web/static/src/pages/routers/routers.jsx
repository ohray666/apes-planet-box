import React from "react";
import { hot, setConfig } from "react-hot-loader";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Simulator from "../simulator/simulator.jsx";
import NotFound from "../not-found/not-found.jsx";

class Routers extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="*" component={Simulator} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default hot(module)(Routers);
