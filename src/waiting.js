import React, { Component } from 'react';
import io from 'socket.io-client';
const socket = io("http://localhost:4000");

class waiting extends Component{

  state = {
    my_id : null,
    roomInfo : [],
    members : []
  }

  // findName(id){
  //   let name;
  //   this.state.members.forEach((member) =>{
  //     if(id === member.id){
  //       name = member.name;
  //     }
  //     return name;
  //   })
  // }

  componentDidMount(){
    let url = window.location.href;
    let room_id = url.substring( url.indexOf('=')+1, url.length );
    socket.emit('getRoomInfo', room_id);

    socket.on('getRoomInfo', (room_info, clients) =>{
      this.setState({
        members : []
      });
      clients.forEach(client => {
        
        Object.keys(Object.values(room_info)[0]).forEach(info =>{
          if(client.id === info){
            this.setState({
              members : [...this.state.members, client.name]
            })
          }
        })
      });
    });

  }

  render(){
    // console.log(Object.values(this.state.roomInfo)[0]);
    const members = this.state.members.map((member, i) =>(
      <li key={i}>{Object.values(member)}</li>
    ))
    return(
      <div>
        {members}
      </div>
    )
  }
}

export default waiting