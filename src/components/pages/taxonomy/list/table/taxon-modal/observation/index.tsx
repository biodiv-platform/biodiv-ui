import { Box, Skeleton, Text } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import LocalLink from "@components/@core/local-link";
import React from "react";

import useObsCount from "./use-observation-count";

export function ObservationsLink({ showTaxon }) {
  const { countsData } = useObsCount(showTaxon);

  return (
    <Skeleton isLoaded={!countsData.data.isLoading} borderRadius="lg" lineHeight={1}>
      <Box p={2} className="white-box" borderRadius="lg" lineHeight={1}>
        <Text fontSize="3xl" mb={2}>
          {countsData.data.value}
        </Text>
        <LocalLink href={`/observation/list`} params={{ taxon: showTaxon }}>
          <ExternalBlueLink>Observations</ExternalBlueLink>
        </LocalLink>
      </Box>
    </Skeleton>
  );
}
