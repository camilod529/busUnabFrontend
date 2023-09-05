import React from "react";
import ReactDOM from "react-dom/client";
import { BusUnabApp } from "./BusUnabApp";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./store";

import "./css/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <BusUnabApp />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
