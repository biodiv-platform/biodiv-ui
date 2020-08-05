import { Flex, Heading, Text } from "@chakra-ui/core";
import React from "react";

export default function TextView({ name, value }) {
  return value ? (
    <Flex alignItems="center">
      <Heading m={3} size="md">
        {name}
      </Heading>
      <Text fontSize="lg">{value}</Text>
    </Flex>
  ) : null;
}
