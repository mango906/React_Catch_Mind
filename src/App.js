import React, { Component } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Main from "./components/main/main";
import Waiting from "./components/waiting/waiting";
import Drawing from "./components/drawing/drawing";

import io from "socket.io-client";
const socket = io(window.location.origin.replace(window.location.port, "") + "4000");

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route
              exact
              path="/"
              component={props => <Main {...props} socket={socket} store={this.props.store} />}
            />
            <Route
              path="/waiting"
              component={props => <Waiting {...props} socket={socket} store={this.props.store} />}
            />
            <Route
              path="/drawing"
              component={props => <Drawing {...props} socket={socket} store={this.props.store} />}
            />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
