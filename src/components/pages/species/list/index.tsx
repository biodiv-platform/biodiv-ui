import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import Filters from "./filter";
import ListHeader from "./header";
import ListTiles from "./list-tiles";

export default function SpeciesListPageComponent() {
  return (
    <Box w="full" maxH="calc( 100vh - var(--heading-height) )" display="flex">
      <SimpleGrid w="full" columns={{ base: 1, lg: 14 }}>
        <Filters />
        <Box
          maxH="full"
          w="full"
          id="items-container"
          overflowY="auto"
          gridColumn={{ lg: "4/15" }}
          px={4}
        >
          <ListHeader />
          <ListTiles />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
