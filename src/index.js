import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import App from "./App";
import "normalize.css";

/*
 * Action
 */

export function setRoomID(room_id) {
  return {
    type: "ROOM_ID",
    room_id: room_id
  };
}

/*
 * Reducer
 */
const initialState = {
  room_id: -1
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ROOM_ID":
      return Object.assign({}, state, {
        room_id: action.room_id
      });
    default:
      return state;
  }
};

/*
 * Store
 */
const store = createStore(roomReducer);

ReactDOM.render(<App store={store} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
