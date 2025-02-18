import React from "react";

import "./Button.css";

const Button = ({ type, text, icon, size, filled, onClick, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button text--primary
        ${size === "large" ? "button--large" : "button--medium"} 
        ${filled ? "button--filled" : "button--transparent"}
        ${!text && icon && "button--icon"}`}
    >
      {text} {icon}
    </button>
  );
};

export default Button;
