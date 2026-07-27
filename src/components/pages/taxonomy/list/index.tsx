import { Box, SimpleGrid } from "@chakra-ui/react";

import BulkMapperModal from "./bulk-mapper";
import { Filters } from "./filters";
import TaxonListTable from "./table";
import TaxonShowModal from "./table/taxon-modal";

export default function TaxonListComponent() {
  return (
    <Box w="full" h="calc(100vh - var(--heading-height))" overflow="hidden" display="flex">
      <TaxonShowModal />
      <SimpleGrid w="full" h="full" columns={{ base: 1, lg: 14 }}>
        <Filters />
        <Box
          h="calc(100vh - var(--heading-height))"
          w="full"
          id="items-container"
          overflowY="auto"
          gridColumn={{ lg: "4/15" }}
          px={4}
        >
          <TaxonListTable />
        </Box>
      </SimpleGrid>
      <BulkMapperModal />
    </Box>
  );
}
