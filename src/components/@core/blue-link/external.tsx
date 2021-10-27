import { ExternalLinkIcon } from "@chakra-ui/icons";
import { LinkProps } from "@chakra-ui/react";
import React, { forwardRef } from "react";

import BlueLink from ".";

export const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer noopener"
};

const ExternalBlueLink = forwardRef((props: LinkProps, ref) => (
  <BlueLink {...props} {...externalLinkProps} wordBreak="break-word" ref={ref}>
    {props?.children || (props.href && decodeURIComponent(props.href))} <ExternalLinkIcon />
  </BlueLink>
));

export default ExternalBlueLink;
