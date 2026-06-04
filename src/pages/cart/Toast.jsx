import React from "react";

const Toast = ({ message, icon, visible }) => (
  <div className={`toast ${visible ? "show" : ""}`} id="toast">
    <div className="toast-content">
      <span className="toast-icon">{icon}</span>
      <span className="toast-msg" id="toast-msg">{message}</span>
    </div>
  </div>
);

export default Toast;
