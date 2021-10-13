import { Box, Text } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import LocalLink from "@components/@core/local-link";
import React from "react";

import { useSpeciesId } from "./use-species-id";

export function SpeciesPageLink({ showTaxon }) {
  let count = 0;
  let speciesId = null;
  if (showTaxon) {
    speciesId = useSpeciesId(showTaxon);
    count = 1;
  }

  return (
    <Box borderRadius="md">
      <Box p={1} className="white-box" lineHeight={1} borderTopRadius="md">
        <Text fontSize="3xl" mb={2}>
          {count}
        </Text>
        {speciesId ? (
          <LocalLink href={`/species/show/${speciesId}`}>
            <ExternalBlueLink>Species</ExternalBlueLink>
          </LocalLink>
        ) : (
          <Text>Species</Text>
        )}
      </Box>
    </Box>
  );
}
