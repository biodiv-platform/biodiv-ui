import dynamic from "next/dynamic";
import { Fragment } from "react";

const NoSSRI = (props) => <Fragment>{props.children}</Fragment>;

const NoSSR = dynamic(() => Promise.resolve(NoSSRI), {
  ssr: false
});

export default NoSSR;
