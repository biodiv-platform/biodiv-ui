import { Heading, HeadingProps, Stack } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface PageHeadingProps {
  children?: ReactNode;
  mb?: number;
  actions?: ReactNode;
  [x: string]: any;
  size?: HeadingProps["size"];
}

export default function PageHeading({
  children,
  className,
  mb = 4,
  actions,
  size = "4xl",
  ...props
}: PageHeadingProps) {
  return (
    <Stack
      flexDirection={["column", "row"]}
      justify="space-between"
      mb={mb}
      className={className}
      gap={0}
    >
      <Heading as="h1" size={size} display="inline-block" {...props}>
        {children}
      </Heading>
      {actions}
    </Stack>
  );
}
