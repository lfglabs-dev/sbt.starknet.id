import React, { FunctionComponent } from "react";
import { MutatingDots } from "react-loader-spinner";

interface LoadingProps {
    [key: string]: any;
}

const Loading:FunctionComponent<LoadingProps> = (props) => {
    return <MutatingDots
        height="100"
        width="100"
        color="#19AA6E"
        secondaryColor="#BF9E7B"
        ariaLabel="loading"
        {...props}
    />
};

export default Loading;