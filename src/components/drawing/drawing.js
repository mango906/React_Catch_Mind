import React, { Component } from "react";
import "./../../css/drawing.css";
class Drawing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      my_id: null,
      ctx: null,
      drawable: false,
      lineWidth: 0,
      chatContent: null,
      chats: [],
      members: [],
      word: null,
      count: null,
      // time: 90,
      drawer: false
    };
  }

  componentWillMount() {
    // const { socket } = this.props;
  }

  componentDidMount() {
    const { socket } = this.props;
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // if (this.state.word == "?") {
    //   this.setState({
    //     drawer: false
    //   });
    // } else {
    //   this.setState({
    //     drawer: true
    //   });
    // }

    // this.setState({
    //   ctx: ctx
    // });

    socket.emit("getId");

    socket.on("getId", id => {
      this.setState({
        my_id: id
      });
    });

    socket.emit("getRoomInfo", this.props.store.getState().room_id);

    socket.on("getRoomInfo", clients => {
      console.log("getRoomInfo");
      this.setState({
        members: clients
      });
    });

    socket.emit("gameInfo", this.props.store.getState().room_id);

    socket.on("gameInfo", (word, count, drawer) => {
      console.log(word);
      this.setState({
        word: word,
        count: count,
        drawer: drawer
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

    socket.on("drawing_chat", chatObject => {
      console.log(chatObject);
      this.setState({
        chats: [...this.state.chats, chatObject]
      });
    });

    socket.on("correctAnswer", sentence => {
      alert(sentence);
      this.resetCanvas();
    });

    // socket.on("time", time => {
    //   console.log(time);
    //   this.setState({
    //     time: time
    //   });
    // });

    // socket.on("time_over", sentence => {
    //   alert(sentence);
    // });
  }

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

  //reset Canvas

  resetCanvas = () => {
    const ctx = this.canvas.getContext("2d");
    //line width reset
    ctx.lineWidth = "1";
    //canvas reset
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.beginPath();
    //line color reset
    ctx.strokeStyle = "#000";
    //slider reset
    this.slider.value = "1";
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
      value: this.state.chatContent,
      room_id: this.props.store.getState().room_id
    };
    this.setState({
      chatContent: ""
    });
    socket.emit("drawing_chat", chatObject);
  };

  // componentWillUnmount() {
  //   console.log("component unmount");
  // }

  render() {
    const chats = this.state.chats.map((chat, i) => {
      return (
        <li key={i}>
          {chat.name} : {chat.value}
        </li>
      );
    });
    const clients = this.state.members.map((member, i) => {
      return (
        <li className="member" key={i}>
          <img src={require("./../../image/character.png")} />
          <div>{member}</div>
        </li>
      );
    });
    console.log(this.state.members);
    return (
      <div className="Drawing">
        <canvas
          style={{ float: "left" }}
          className="canvas"
          width={1536}
          height={730}
          onMouseDown={this.state.drawer && this.initDrawEvent.bind(this)}
          onMouseMove={this.state.drawer && this.drawEvent.bind(this)}
          onMouseUp={this.state.drawer && this.finishDrawEvent.bind(this)}
          onMouseOut={this.state.drawer && this.finishDrawEvent.bind(this)}
          ref={ref => {
            this.canvas = ref;
          }}
        />
        <div className="question">
          <div className="answer center">{this.state.word}</div>
          <div className="count center">{this.state.count} / 10</div>
          {/* <div className="timer" style={{ width: this.state.time + "%" }} /> */}
        </div>
        <div className="chats">
          <div className="chatContent">{chats}</div>
          <div className="chatInput">
            <input
              className="chatForm"
              value={this.state.chatContent}
              onChange={this.onChangeChat}
            />
            <button className="chatSubmitBtn" onClick={!this.state.drawer && this.submitChatEvent}>
              전송
            </button>
          </div>
        </div>
        <div className="tools">
          <div>
            <button className="red" onClick={this.state.drawer && this.colorChangeEvent} />
            <button className="yellow" onClick={this.state.drawer && this.colorChangeEvent} />
            <button className="green" onClick={this.state.drawer && this.colorChangeEvent} />
            <button className="blue" onClick={this.state.drawer && this.colorChangeEvent} />
            <button className="black" onClick={this.state.drawer && this.colorChangeEvent} />
          </div>
          <div style={{ marginTop: "15px" }}>
            <input
              type="range"
              className="slider"
              ref={ref => {
                this.slider = ref;
              }}
              min="1"
              max="20"
              value={this.state.lineWidth}
              onChange={this.state.drawer && this.handleChange}
            />
            <img
              className="eraserBtn"
              onClick={this.state.drawer && this.setEraserEvent}
              src={require("./../../image/eraser.png")}
            />
            <img
              className="clearBtn"
              src={require("./../../image/trash.png")}
              onClick={this.state.drawer && this.clearEvent}
            />
          </div>
        </div>
        <div className="members">{clients}</div>
      </div>
    );
  }
}

export default Drawing;
