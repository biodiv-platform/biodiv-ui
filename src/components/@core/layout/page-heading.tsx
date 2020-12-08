import { Heading, Stack } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface PageHeadingProps {
  children?: ReactNode;
  mb?: number;
  actions?: ReactNode;
  [x: string]: any;
}

export default function PageHeading({ children, mb = 4, actions, ...props }: PageHeadingProps) {
  return (
    <Stack flexDirection={["column", "row"]} justify="space-between" mb={mb}>
      <Heading as="h1" display="inline-block" {...props}>
        {children}
      </Heading>
      {actions}
    </Stack>
  );
}
