import React from "react";

import "./Button.css";

const Button = ({ type, text, icon, onClick, disabled, size, filled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button 
        ${size === "large" ? "button--large" : "button--medium"} 
        ${filled ? "button--filled" : "button--transparent"}
        ${!text && icon && "button--icon"}`}
    >
      {text} {icon}
    </button>
  );
};

export default Button;
