import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import Filters from "./filters";
import useTranslation from "@hooks/use-translation";
import ListView from "./view/list-view";

interface DocumentListPageProps {
  nextOffset: number;
}

export default function DocumentListPageComponent({ nextOffset }: DocumentListPageProps) {
  const { t } = useTranslation();

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
          <Heading my={4} size="md">
            {t("DOCUMENT.LIST.TITLE")}
          </Heading>
          <ListView no={nextOffset} />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
