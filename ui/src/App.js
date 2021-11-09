  
import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import OnboardingPage from './pages/OnboardingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import PlaylistPage from './pages/PlaylistPage.jsx';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={OnboardingPage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/playlists" component={PlaylistPage} />
          {/* <Route exact path="/404" component = {NotFound}/> */}
          {/* <Redirect to="/404"/> */}
        </Switch>
      </BrowserRouter>
    );
  }
}

const container = document.getElementById("app");
render(<App />, container);