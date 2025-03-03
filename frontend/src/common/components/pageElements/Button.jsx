import React from "react";

import "./Button.css";

const Button = ({
  type,
  text,
  icon,
  size,
  filled,
  onClick,
  disabled,
  classNames,
}) => {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      disabled={disabled}
      className={`button text--primary
        ${size === "large" ? "button--large" : "button--medium"} 
        ${filled ? "button--filled" : "button--transparent"}
        ${!text && icon && "button--icon"}
        ${classNames}`}
    >
      {text} {icon}
    </button>
  );
};

export default Button;
