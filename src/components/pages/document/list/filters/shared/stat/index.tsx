import { Box } from "@chakra-ui/react";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { getByPath } from "@utils/basic";
import { toHumanString } from "human-readable-numbers";
import React from "react";

export default function FilterStat({ statKey, subStatKey }) {
  const {
    documentData: { n } //number must be replace with ag
  } = useDocumentFilter();
  const path = statKey ? [statKey, subStatKey].join(".") : subStatKey;
  const count = getByPath(n, path);

  return (
    <Box color="gray.500" as="span" title={count}>
      {` - ${toHumanString(count || 0)}`}
    </Box>
  );
}
