import { Box } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { getByPath } from "@utils/basic";
import { toHumanString } from "human-readable-numbers";
import React from "react";

export default function FilterStat({ statKey, subStatKey }) {
  const { observationData } = useObservationFilter();
  const path = statKey ? [statKey, subStatKey.split("|")[0]].join(".") : subStatKey.split("|")[0];
  const count = getByPath(observationData?.ag, path);

  return (
    <Box color="gray.500" as="span" title={count}>
      {` - ${toHumanString(count || 0)}`}
    </Box>
  );
}
