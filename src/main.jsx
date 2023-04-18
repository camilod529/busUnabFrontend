import React from "react";
import ReactDOM from "react-dom/client";
import { BusUnabApp } from "./BusUnabApp";
import { BrowserRouter } from "react-router-dom";

import "./css/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <BusUnabApp />
  </BrowserRouter>
  // </React.StrictMode>
);
