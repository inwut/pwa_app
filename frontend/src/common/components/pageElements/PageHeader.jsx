import React from "react";

import "./PageHeader.css";

const PageHeader = ({ children }) => {
  return <section className="page-header">{children}</section>;
};

export default PageHeader;
