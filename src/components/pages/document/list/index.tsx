import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import Filters from "./filters";
import Headers from "./headers";
import ListView from "./view/list-view";

interface DocumentListPageProps {
  nextOffset: number;
}

export default function DocumentListPageComponent({ nextOffset }: DocumentListPageProps) {
  return (
    <Box w="full" maxH="calc( 100vh - var(--heading-height) )" display="flex">
      <SimpleGrid w="full" columns={[1, 1, 1, 5]}>
        <Filters />
        <Box
          maxH="full"
          w="full"
          id="items-container"
          overflowY="auto"
          gridColumn={[null, null, null, "2/6"]}
          p={4}
        >
          <Headers />
          <ListView no={nextOffset} />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
