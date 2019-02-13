import React, { Component } from "react";
import "./drawing.css";
class Drawing extends Component {
  state = {
    ctx: null,
    drawable: false
  };

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

  colorChangeEvent = e => {
    const { socket } = this.props;
    let color = e.target.className;
    socket.emit("setColor", color);
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
  }

  render() {
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
          <div>
            <input type="range" className="slider" />
            <img className="eraserBtn" src={require("./image/eraser.png")} />
            <img className="removeBtn" src={require("./image/trash.png")} />
          </div>
        </div>
      </div>
    );
  }
}

export default Drawing;
