import React, { Component } from "react";
import "./waiting.css";
import character from "./character.png";

class waiting extends Component {
  state = {
    my_id: null,
    roomInfo: [],
    members: [],
    room_master: false,
    chatContent: null,
    room_id: null
  };

  updateInputEvent = e => {
    this.setState({
      chatContent: e.target.value
    });
  };

  submitChatEvent = () => {
    const { socket } = this.props;
    console.log(this.state.chatContent);
  };

  componentDidMount() {
    const { socket } = this.props;

    let url = window.location.href;
    let room_id = url.substring(url.indexOf("=") + 1, url.length);
    this.setState({
      room_id: room_id
    });
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

      socket.on("room_master", msg => {
        this.setState({
          room_master: true
        });
      });
    });
  }

  render() {
    const members = this.state.members.map((member, i) => (
      <li key={i}>
        <div>방장</div>
        <img src={character} alt={"character"} />
        <span>{member}</span>
      </li>
    ));
    let startBtn;
    if (this.state.room_master) {
      startBtn = <button className="startBtn">GAME START</button>;
    }

    return (
      <div>
        <ul className="room-member">
          {members}
          {/* <li>
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
          </li> */}
        </ul>
        <input className="chat" onChange={this.updateInputEvent} />
        <button className="submitBtn" onClick={this.submitChatEvent}>
          전송
        </button>
        <div className="chat-area" />
        {startBtn}
      </div>
    );
  }
}

export default waiting;
