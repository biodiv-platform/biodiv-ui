import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import Filters from "./filters";
import ListHeader from "./header";
import Views from "./views";

interface ObservationListPageProps {
  nextOffset: number;
}

export default function ObservationListPageComponent({ nextOffset }: ObservationListPageProps) {
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
          <ListHeader />
          <Views no={nextOffset} />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
