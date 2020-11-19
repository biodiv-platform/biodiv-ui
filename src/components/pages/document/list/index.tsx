import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import Views from "./view";
import Filters from "./filters";

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
          px={4}
        >
          <Views no={nextOffset} />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
