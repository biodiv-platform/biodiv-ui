import { LinkProps } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React from "react";

import BlueLink from ".";

export const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer noopener"
};

const ExternalBlueLink = (props: LinkProps) => (
  <BlueLink {...props} {...externalLinkProps} wordBreak="break-word">
    {props?.children || (props.href && decodeURIComponent(props.href))} <ExternalLinkIcon />
  </BlueLink>
);

export default ExternalBlueLink;
