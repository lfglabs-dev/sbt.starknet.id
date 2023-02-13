import React, { FunctionComponent } from "react";
import { MutatingDots } from "react-loader-spinner";

const Loading: FunctionComponent = (props) => {
  return (
    <MutatingDots
      height="100"
      width="100"
      color="#19AA6E"
      secondaryColor="#BF9E7B"
      ariaLabel="loading"
      {...props}
    />
  );
};

export default Loading;
