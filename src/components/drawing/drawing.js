import React, { Component } from "react";
import "./../../css/drawing.css";
class Drawing extends Component {
  state = {
    my_id: null,
    ctx: null,
    drawable: false,
    lineWidth: 0,
    chatContent: null,
    chats: []
  };

  //Drawing

  initDrawEvent(e) {
    const { socket } = this.props;
    let pageLocation = {
      pageX: e.pageX,
      pageY: e.pageY
    };
    let location = this.getPosition(pageLocation);
    socket.emit("initDraw", location);
  }

  initDraw = location => {
    this.setState({
      drawable: true
    });
    this.canvas.getContext("2d").moveTo(location.X, location.Y);
    // this.canvas.getContext("2d").lineWidth = lineWidth;
  };

  drawEvent = e => {
    const { socket } = this.props;
    if (this.state.drawable) {
      let pageLocation = {
        pageX: e.pageX,
        pageY: e.pageY
      };
      let location = this.getPosition(pageLocation);
      socket.emit("Draw", location);
    }
  };

  draw = location => {
    this.canvas.getContext("2d").lineTo(location.X, location.Y);
    this.canvas.getContext("2d").stroke();
  };

  finishDrawEvent = () => {
    const { socket } = this.props;
    socket.emit("finishDraw");
  };

  finishDraw = () => {
    this.setState({
      drawable: false
    });
  };

  getPosition = location => {
    var rect = this.canvas.getBoundingClientRect();
    let x = location.pageX - rect.left;
    let y = location.pageY - rect.top;
    return { X: x, Y: y };
  };

  //Drawing tool

  colorChangeEvent = e => {
    const { socket } = this.props;
    let color = e.target.className;
    socket.emit("setColor", color);
  };

  handleChange = e => {
    const { socket } = this.props;
    socket.emit("selectWidth", e.target.value);
    this.setState({
      lineWidth: e.target.value
    });
  };

  setEraserEvent = () => {
    const { socket } = this.props;
    socket.emit("setEraser");
  };

  clearEvent = () => {
    const { socket } = this.props;
    socket.emit("canvasClear");
  };

  //Chatting

  onChangeChat = e => {
    this.setState({
      chatContent: e.target.value
    });
  };

  submitChatEvent = () => {
    const { socket } = this.props;
    let chatObject = {
      id: this.state.my_id,
      value: this.state.chatContent
    };
    this.state.chatContent = "";
    socket.emit("chat", chatObject);
  };

  componentDidMount() {
    const { socket } = this.props;
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.setState({
      ctx: ctx
    });

    socket.emit("getId");

    socket.on("getId", id => {
      this.setState({
        my_id: id
      });
    });

    socket.on("initDraw", location => {
      ctx.beginPath();
      this.initDraw(location);
    });

    socket.on("Draw", location => {
      this.draw(location);
    });

    socket.on("finishDraw", () => {
      this.finishDraw();
    });

    socket.on("setColor", color => {
      ctx.strokeStyle = color;
    });

    socket.on("selectWidth", width => {
      this.setState({
        lineWidth: width
      });
      this.canvas.getContext("2d").lineWidth = width;
    });

    socket.on("setEraser", () => {
      this.canvas.getContext("2d").strokeStyle = "#fff";
    });

    socket.on("canvasClear", () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    });

    socket.on("chat", chatObject => {
      console.log(chatObject);
      this.setState({
        chats: [...this.state.chats, chatObject]
      });
      console.log(this.state.chats);
    });
  }

  render() {
    const chats = this.state.chats.map((chat, i) => {
      return (
        <li key={i}>
          {chat.name} : {chat.value}
        </li>
      );
    });
    return (
      <div className="Drawing">
        <canvas
          style={{ float: "left" }}
          className="canvas"
          width={1536}
          height={730}
          onMouseDown={this.initDrawEvent.bind(this)}
          onMouseMove={this.drawEvent.bind(this)}
          onMouseUp={this.finishDrawEvent.bind(this)}
          onMouseOut={this.finishDrawEvent.bind(this)}
          ref={ref => {
            this.canvas = ref;
          }}
        />
        <div className="chats">
          <div className="chatContent">{chats}</div>
          <div className="chatInput">
            <input
              className="chatForm"
              onChange={this.onChangeChat}
              value={this.state.chatContent}
            />
            <button className="chatSubmitBtn" onClick={this.submitChatEvent}>
              전송
            </button>
          </div>
        </div>
        <div className="tools">
          <div>
            <button className="red" onClick={this.colorChangeEvent.bind(this)} />
            <button
              className="yellow"
              onClick={this.colorChangeEvent}
              ref={ref => {
                this.btn = ref;
              }}
            />
            <button className="green" onClick={this.colorChangeEvent} />
            <button className="blue" onClick={this.colorChangeEvent} />
            <button className="black" onClick={this.colorChangeEvent} />
          </div>
          <div style={{ marginTop: "15px" }}>
            <input
              type="range"
              className="slider"
              min="1"
              max="20"
              value={this.state.lineWidth}
              onChange={this.handleChange}
            />
            <img
              className="eraserBtn"
              onClick={this.setEraserEvent}
              src={require("./../../image/eraser.png")}
            />
            <img
              className="clearBtn"
              src={require("./../../image/trash.png")}
              onClick={this.clearEvent}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Drawing;