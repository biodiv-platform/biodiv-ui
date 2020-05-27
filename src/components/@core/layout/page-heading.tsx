import { Heading, Stack } from "@chakra-ui/core";
import React from "react";

export default function PageHeading({ children = null, mb = 4, actions = null, ...props }) {
  return (
    <Stack flexDirection={["column", "row"]} justify="space-between" mb={mb}>
      <Heading as="h1" display="inline-block" {...props}>
        {children}
      </Heading>
      {actions}
    </Stack>
  );
}
