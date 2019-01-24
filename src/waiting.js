import React, { Component } from "react";
import "./waiting.css";
import character from "./character.png";

class waiting extends Component {
  state = {
    my_id: null,
    roomInfo: [],
    members: []
  };

  // findName(id){
  //   let name;
  //   this.state.members.forEach((member) =>{
  //     if(id === member.id){
  //       name = member.name;
  //     }
  //     return name;
  //   })
  // }

  componentDidMount() {
    const { socket } = this.props;

    let url = window.location.href;
    let room_id = url.substring(url.indexOf("=") + 1, url.length);
    socket.emit("getRoomInfo", room_id);

    socket.on("getRoomInfo", (room_info, clients) => {
      console.log("getRoomInfo");
      this.setState({
        members: []
      });
      clients.forEach(client => {
        Object.keys(Object.values(room_info)[0]).forEach(info => {
          if (client.id === info) {
            this.setState({
              members: [...this.state.members, client.name]
            });
          }
        });
      });
    });
  }

  render() {
    // console.log(Object.values(this.state.roomInfo)[0]);
    const members = this.state.members.map((member, i) => <li key={i}>{Object.values(member)}</li>);
    return (
      <div>
        <div>{members}</div>
        <ul className="room-member">
          <li>
            <div>방장</div>
            <img src={character} alt={"character"} />
            <span>유저</span>
          </li>
          <li>
            <div />
            <img src={character} alt={"character"} />
          </li>
          <li>
            <div />
            <img src={character} alt={"character"} />
          </li>
          <li>
            <div />
            <img src={character} alt={"character"} />
          </li>
        </ul>
        <input className="chat" />
        <button className="submitBtn">전송</button>
        <div className="chat-area" />
        <button className="startBtn">GAME START</button>
      </div>
    );
  }
}

export default waiting;
