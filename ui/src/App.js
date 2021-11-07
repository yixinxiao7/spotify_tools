  
import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Login from './pages/Login.jsx';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/authorize" component={Login} />
          {/* <Route exact path="/404" component = {NotFound}/> */}
          {/* <Redirect to="/404"/> */}
        </Switch>
      </BrowserRouter>
    );
  }
}

const container = document.getElementById("app");
render(<App />, container);