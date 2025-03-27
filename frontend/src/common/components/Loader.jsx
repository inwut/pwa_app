import React from "react";
import { BeatLoader } from "react-spinners";

const Loader = ({ style }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3rem",
        ...style,
      }}
    >
      <BeatLoader color="#476730" size={25} />
    </div>
  );
};

export default Loader;
