import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import Filters from "./filters";
import ListHeader from "./header";
import Views from "./view/grid";

export default function UserListComponent() {
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
          <Views />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
