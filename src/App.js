import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './main'

import io from 'socket.io-client';
const socket = io("http://localhost:4000");

class App extends Component {

  componentDidMount(){
    console.log(socket);
    socket.emit("hi");
  }

  render() {
    return (
      <div className="App">
        <Main></Main>
      </div>
    );
  }
}

export default App;
