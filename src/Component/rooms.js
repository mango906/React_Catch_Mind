import React, { Component } from "react";
class rooms extends Component {
  state = {
    rooms: []
  };

  createRoomEvent = () => {
    let room_name = prompt("방 이름을 입력해주세요.");
    console.log(this.props.my_id);
    socket.emit("createRoom", room_name, this.props.my_id);
  };

  joinRoomEvent = i => {
    let room_id = this.state.rooms[i].room_id;
    socket.emit("joinRoom", room_id);
  };

  componentDidMount() {
    socket.on("roomlist", rooms => {
      this.setState({
        rooms: rooms
      });
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

    return (
      <div>
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
      </div>
    );
  }
}

export default rooms;
