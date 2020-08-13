import { Icon, LinkProps } from "@chakra-ui/core";
import React from "react";

import BlueLink from ".";

export default function ExternalBlueLink(props: LinkProps) {
  return (
    <BlueLink {...props} target="_blank" rel="noreferrer noopener" wordBreak="break-word">
      {props?.children || decodeURIComponent(props.href)} <Icon name="external-link" />
    </BlueLink>
  );
}
