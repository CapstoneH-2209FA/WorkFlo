import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import history from "./history";
import store from "./store";
import App from "./App";
import "./styles/Background.css";

ReactDOM.render(
  <Provider store={store} className="backgroundMain">
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("app")
);
