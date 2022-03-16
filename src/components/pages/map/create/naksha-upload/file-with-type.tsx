import { Flex } from "@chakra-ui/react";
import React from "react";

export function FileWithType({ type }) {
  return (
    <Flex
      boxSize="44px"
      borderRadius="md"
      bgColor="#193772"
      color="#00D5EE"
      textTransform="uppercase"
      alignItems="center"
      justifyContent="center"
      lineHeight={1}
      fontSize="sm"
    >
      <div>{type}</div>
    </Flex>
  );
}
