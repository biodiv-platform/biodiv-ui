import { Box, Heading } from "@chakra-ui/react";
import React from "react";

export default function Section(props) {
  return (
    <Box borderColor="gray.300" mb={4} borderWidth="thin">
      <Heading p={4} as="h3" size="sm" fontWeight="semibold" color="gray.500">
        {props.heading}
      </Heading>
      {props.children}
    </Box>
  );
}
