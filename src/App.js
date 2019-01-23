import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import Main from './main'
import Waiting from './waiting'


class App extends Component {

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={Main}></Route>  
            <Route path="/waiting" component={Waiting}></Route>  
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
