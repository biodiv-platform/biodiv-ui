import { Box } from "@chakra-ui/react";
import React from "react";

import useSpecies from "../../../use-species";
import DocumentItem from "./document-item";

export default function DocumentsField() {
  const { species } = useSpecies();

  return (
    <Box mb={4}>
      {species?.documentMetaList?.map((d) => (
        <DocumentItem key={d.id} document={d} />
      ))}
    </Box>
  );
}
