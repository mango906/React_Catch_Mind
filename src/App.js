import React, { Component } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import Main from "./main";
import Waiting from "./waiting";

import io from "socket.io-client";
const socket = io("http://localhost:4000");

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={props => <Main {...props} socket={socket} />} />
            <Route path="/waiting" component={props => <Waiting {...props} socket={socket} />} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
