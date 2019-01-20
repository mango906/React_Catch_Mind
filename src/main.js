import React, { Component } from 'react'
import './main.css'

class main extends Component{
  render(){
    return(
      <div className="main">
        <div className="roomlist">
          <div>
            <span>방 목록</span>
            <button className="createRoomBtn">방 만들기</button>
          </div>
          <table >
            <thead>
              <tr>
                <th>방 번호</th>
                <th>방 이름</th>
                <th>방장</th>
                <th>인원</th>
              </tr>
            </thead>
            <tbody className="rooms">

            </tbody>
          </table>
        </div>
        <div className="usernav">
          <div>접속자 명단</div>
          <ul className="users"></ul>
        </div>

        <ul className="chat-list">
          <div>채팅</div>
        </ul>
        <div className="chat-form">
          <input type="text" name="chatContent" placeholder="채팅" />
          <input type="button" name="chatBtn" value="전송" />
        </div>
      </div>
    )
  }
}

export default main;