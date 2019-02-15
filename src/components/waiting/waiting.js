import React, { Component } from "react";
import "./../../css/waiting.css";
import character from "./../../image/character.png";

class waiting extends Component {
  state = {
    my_id: null,
    roomInfo: [],
    members: [],
    room_master: false,
    chatContent: null,
    room_id: null,
    chatList: []
  };

  updateInputEvent = e => {
    this.setState({
      chatContent: e.target.value
    });
  };

  submitChatEvent = () => {
    const { socket } = this.props;
    if (this.state.chatContent != null) {
      let chat = {
        id: this.state.my_id,
        content: this.state.chatContent
      };
      console.log(chat);
      socket.emit("waiting_chat", chat);
    }
    this.chatInput.value = "";
  };

  startEvent = () => {
    console.log("startEvent");
    const { socket } = this.props;
    socket.emit("game_start", this.state.room_id);
  };

  componentDidMount() {
    const { socket } = this.props;

    let url = window.location.href;
    let room_id = url.substring(url.indexOf("=") + 1, url.length);

    this.setState({
      room_id: room_id
    });

    socket.emit("getId");

    socket.on("getId", id => {
      this.setState({
        my_id: id
      });
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

    socket.on("waiting_chat", chatData => {
      this.setState({
        chatList: [...this.state.chatList, chatData]
      });
    });

    socket.on("game_start", () => {
      this.props.history.push("/drawing");
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
    const chats = this.state.chatList.map((chat, i) => (
      <li key={i}>
        {chat.name} : {chat.content}
      </li>
    ));

    let startBtn;
    if (this.state.room_master) {
      startBtn = (
        <button className="startBtn" onClick={this.startEvent}>
          GAME START
        </button>
      );
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
        <input
          className="chat"
          onChange={this.updateInputEvent}
          ref={ref => {
            this.chatInput = ref;
          }}
        />
        <button className="submitBtn" onClick={this.submitChatEvent}>
          전송
        </button>
        <ul className="chat-area">{chats}</ul>
        {startBtn}
      </div>
    );
  }
}

export default waiting;
