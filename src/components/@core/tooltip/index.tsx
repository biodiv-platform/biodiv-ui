import React from "react";

import { Tooltip as T, TooltipProps } from "@/components/ui/tooltip";
interface ITooltipProps extends TooltipProps {
  title: any;
}

export default function Tooltip({ title, children, ...rest }: Partial<ITooltipProps>) {
  return (
    <T aria-label={title} content={title} {...rest}>
      {children}
    </T>
  );
}
