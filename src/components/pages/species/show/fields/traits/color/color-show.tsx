import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";

export const TraitColorShow = ({ traitValues }) => (
  <SimpleGrid columns={{ md: 3 }} spacing={4}>
    {traitValues.map((value) => (
      <Box
        key={value.value}
        border="2px"
        borderColor="rgba(0,0,0,0.1)"
        borderRadius="md"
        lineHeight={1}
        h="3.25rem"
        bg={value.value}
      />
    ))}
  </SimpleGrid>
);
