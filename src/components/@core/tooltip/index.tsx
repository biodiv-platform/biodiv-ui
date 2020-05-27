import { Tooltip as T, TooltipProps } from "@chakra-ui/core";
import React from "react";

export default function Tooltip({ title, children, ...rest }: Partial<TooltipProps>) {
  return (
    <T aria-label={title} label={title} {...rest}>
      {children}
    </T>
  );
}
