import React, { Component } from 'react';
import io from 'socket.io-client';
const socket = io("http://localhost:4000");

class waiting extends Component{

  state = {
    my_id : null,
    roomInfo : null
  }

  componentDidMount(){
    let url = window.location.href;
    let room_id = url.substring( url.indexOf('=')+1, url.length );
    socket.emit('getRoomInfo', room_id)

    socket.on('getRoomInfo', (roomInfo) =>{
      console.log(roomInfo);
    })
  }

  render(){
    // const roomMember = 
    return(
      <div>안녕</div>
    )
  }
}

export default waiting