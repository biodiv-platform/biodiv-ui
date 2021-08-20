import { Box, SimpleGrid } from "@chakra-ui/layout";
import React from "react";

import { Filters } from "./filters";
import TaxonListTable from "./table";
import TaxonShowModal from "./table/taxon-modal";

export default function TaxonListComponent() {
  return (
    <Box w="full" h="100vh" maxH="calc( 100vh - var(--heading-height) )" display="flex">
      <TaxonShowModal />
      <SimpleGrid w="full" columns={{ base: 1, lg: 14 }}>
        <Filters />
        <TaxonListTable />
      </SimpleGrid>
    </Box>
  );
}
