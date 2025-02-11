import React from "react";

import "./PageHeader.css";

const PageHeader = ({ children }) => {
  return (
    <section className="page-header page-header--view">{children}</section>
  );
};

export default PageHeader;
