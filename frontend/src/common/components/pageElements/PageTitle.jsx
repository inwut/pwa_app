import React from "react";

import "./PageTitle.css";

const PageTitle = ({ text, classNames }) => {
  return <h2 className={`page-title text--heading ${classNames}`}>{text}</h2>;
};

export default PageTitle;
