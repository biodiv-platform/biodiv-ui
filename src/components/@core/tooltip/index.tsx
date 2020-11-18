import { Tooltip as T, TooltipProps } from "@chakra-ui/react";
import React from "react";

export default function Tooltip({ title, children, ...rest }: Partial<TooltipProps>) {
  return (
    <T aria-label={title} label={title} {...rest}>
      {children}
    </T>
  );
}
