import dynamic from "next/dynamic";
import React from "react";

const NoSSRI = (props) => <React.Fragment>{props.children}</React.Fragment>;

const NoSSR = dynamic(() => Promise.resolve(NoSSRI), {
  ssr: false
});

export default NoSSR;
