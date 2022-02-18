import React, { Component } from "react"
// import { render } from "react-dom"
import { BrowserRouter, Route, Routes , Redirect } from "react-router-dom"
// import { v4 as uuid } from 'uuid';

import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import AllPlaylistsPage from './pages/AllPlaylistsPage.jsx'
import PlaylistPage from "./pages/PlaylistPage"


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<OnboardingPage/>} />
          <Route exact path="/home" element={<HomePage/>} />
          <Route exact path="/playlists" element={<AllPlaylistsPage/>} />
          <Route exact path="/playlists/:id" element={<PlaylistPage/>} />
          {/* <Route exact path="/404" component = {NotFound}/> */}
          {/* <Redirect to="/404"/> */}
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App
// const container = document.getElementById("app");
// render(<App />, container);