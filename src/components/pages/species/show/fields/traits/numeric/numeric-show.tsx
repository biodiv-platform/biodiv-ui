import { Flex, SimpleGrid } from "@chakra-ui/react";
import React from "react";

export default function NumericTraitShow({ values }) {
  return (
    <SimpleGrid columns={{ md: 3 }} gap={4}>
      {values.map((value) => (
        <Flex
          key={value.id}
          border="2px"
          borderColor="gray.300"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          lineHeight={1}
          h="3.25rem"
        >
          <div>{value.value}</div>
        </Flex>
      ))}
    </SimpleGrid>
  );
}
