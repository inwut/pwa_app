import React from "react";

import "./Image.css";

const Image = ({ imageSrc, altText, classNames }) => {
  return <img src={imageSrc} alt={altText} className={`image ${classNames}`} />;
};
export default Image;
