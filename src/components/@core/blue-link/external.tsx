import { LinkProps } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React from "react";

import BlueLink from ".";

export default function ExternalBlueLink(props: LinkProps) {
  return (
    <BlueLink {...props} target="_blank" rel="noreferrer noopener" wordBreak="break-word">
      {props?.children || (props.href && decodeURIComponent(props.href))} <ExternalLinkIcon />
    </BlueLink>
  );
}
