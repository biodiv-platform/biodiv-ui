import { LinkProps } from "@chakra-ui/react";
import React, { forwardRef } from "react";

import BlueLink from ".";

const ExternalBlueLink = forwardRef((props: LinkProps, ref) => (
  <BlueLink {...props} isExternal={true} wordBreak="break-word" ref={ref}>
    {props?.children || (props.href && decodeURIComponent(props.href))}
  </BlueLink>
));

export default ExternalBlueLink;
