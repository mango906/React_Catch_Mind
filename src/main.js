import React, { Component } from "react";
import "./main.css";
// import Rooms from "./Component/rooms"

// import io from 'socket.io-client';
// const socket = io("http://localhost:4000");

class main extends Component {
  state = {
    my_id: null,
    nickname: null,
    chatContent: null,
    roomName: null,
    room_id: null,
    chatlist: [],
    userlist: [],
    rooms: []
  };

  handleChange = e => {
    this.setState({
      chatContent: e.target.value
    });
  };

  submitChatEvent = () => {
    const { socket } = this.props;
    if (this.state.chatContent != null) {
      let chatObject = {
        id: this.state.my_id,
        content: this.state.chatContent
      };
      socket.emit("main_chat", chatObject);
    }
  };

  joinRoomEvent = i => {
    const { socket } = this.props;
    let room_id = this.state.rooms[i].room_id;
    socket.emit("joinRoom", room_id);
  };

  createRoomEvent = () => {
    const { socket } = this.props;
    let room_name = prompt("방 이름을 입력해주세요.");
    socket.emit("createRoom", room_name, this.state.my_id);
  };

  componentDidMount() {
    const { socket } = this.props;
    let name = prompt("이름을 입력해주세요.");
    this.setState({
      nickname: name
    });

    socket.emit("join", name);

    socket.on("getId", id => {
      this.setState({
        my_id: id
      });
    });

    socket.on("users", clients => {
      this.setState({
        userlist: clients
      });
    });

    socket.on("main_chat", chatObject => {
      this.setState({
        chatlist: [...this.state.chatlist, chatObject]
      });
    });

    socket.on("roomlist", rooms => {
      this.setState({
        rooms: rooms
      });
    });

    socket.on("joinRoomSuccess", room_id => {
      this.props.history.push(`/waiting?id=${room_id}`);
    });
  }

  render() {
    const roomlist = this.state.rooms.map((room, i) => (
      <tr
        key={i}
        onClick={() => {
          this.joinRoomEvent(i);
        }}
      >
        <td>{room.room_id}</td>
        <td>{room.room_name}</td>
        <td>{room.room_master}</td>
        <td>{room.detail.length}</td>
      </tr>
    ));

    const userlist = this.state.userlist.map((user, i) => <li key={i}>{user.name}</li>);
    const chatlist = this.state.chatlist.map((chat, i) => (
      <li key={i}>{`${chat.name} : ${chat.content}`}</li>
    ));

    return (
      <div className="main">
        {/* <Rooms my_id={this.state.my_id}></Rooms> */}
        <div className="roomlist">
          <div>
            <span>방 목록</span>
            <button className="createRoomBtn" onClick={this.createRoomEvent}>
              방 만들기
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>방 번호</th>
                <th>방 이름</th>
                <th>방장</th>
                <th>인원</th>
              </tr>
              {roomlist}
            </thead>
            <tbody className="rooms" />
          </table>
        </div>
        <div className="usernav">
          <div>접속자 명단</div>
          <ul className="users">{userlist}</ul>
        </div>

        <ul className="chat-list">
          <div>채팅</div>
          {chatlist}
        </ul>
        <div className="chat-form">
          <input type="text" name="chatContent" onChange={this.handleChange} placeholder="채팅" />
          <input type="button" name="chatBtn" value="전송" onClick={this.submitChatEvent} />
        </div>
      </div>
    );
  }
}

export default main;
