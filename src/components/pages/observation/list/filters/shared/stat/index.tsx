import { Box } from "@chakra-ui/core";
import useObservationFilter from "@hooks/useObservationFilter";
import { toHumanString } from "human-readable-numbers";
import React from "react";

export default function FilterStat({ statKey, subStatKey }) {
  const {
    observationData: { ag }
  } = useObservationFilter();
  const count = statKey ? ag?.[statKey]?.[subStatKey] : ag?.[subStatKey];

  return (
    <Box color="gray.500" as="span" title={count}>
      {` - ${toHumanString(count || 0)}`}
    </Box>
  );
}
