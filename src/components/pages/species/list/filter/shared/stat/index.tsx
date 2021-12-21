import { Box } from "@chakra-ui/react";
import { getByPath } from "@utils/basic";
import { toHumanString } from "human-readable-numbers";
import React from "react";

import useSpeciesList from "../../../use-species-list";

export default function FilterStat({ statKey, subStatKey }) {
  const {
    speciesData: { ag }
  } = useSpeciesList();

  const path = statKey ? [statKey, subStatKey].join(".") : subStatKey;
  const count = getByPath(ag, path);

  return (
    <Box color="gray.500" as="span" title={count}>
      {` - ${toHumanString(count || 0)}`}
    </Box>
  );
}
