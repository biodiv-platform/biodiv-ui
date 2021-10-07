import { Tooltip as T, TooltipProps } from "@chakra-ui/react";
import React from "react";

interface ITooltipProps extends TooltipProps {
  title: any;
}

export default function Tooltip({ title, children, ...rest }: Partial<ITooltipProps>) {
  return (
    <T aria-label={title} label={title} {...rest}>
      {children}
    </T>
  );
}
