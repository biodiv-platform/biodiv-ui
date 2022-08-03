import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { Suspense } from "react";

import CropModal from "../crop-modal";
import BulkMapperModal from "./bulk-mapper";
import FilterFallback from "./filters/fallback";
import ListHeader from "./header";
import Views from "./views";

const Filters = React.lazy(() => import("./filters"));

interface ObservationListPageProps {
  nextOffset: number;
}

export default function ObservationListPageComponent({ nextOffset }: ObservationListPageProps) {
  return (
    <Box w="full" maxH="calc( 100vh - var(--heading-height) )" display="flex">
      <SimpleGrid w="full" columns={{ base: 1, lg: 14 }}>
        <Suspense fallback={<FilterFallback />}>
          <Filters />
        </Suspense>
        <Box
          maxH="full"
          w="full"
          id="items-container"
          overflowY="auto"
          gridColumn={{ lg: "4/15" }}
          px={4}
        >
          <ListHeader />
          <Views no={nextOffset} />
        </Box>
      </SimpleGrid>
      <BulkMapperModal />
      <CropModal />
    </Box>
  );
}
