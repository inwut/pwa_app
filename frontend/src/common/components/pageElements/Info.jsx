import React from "react";

import "./Info.css";

const Info = ({ children, style }) => {
  return (
    <div style={style} className="info text--primary">
      {children}
    </div>
  );
};

export default Info;
