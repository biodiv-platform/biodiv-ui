import { Box } from "@chakra-ui/react";
import { TAXON } from "@static/events";
import React from "react";
import { emit } from "react-gbus";

const POSITION_COLOR = {
  WORKING: "yellow.300",
  CLEAN: "green.300",
  RAW: "gray.300"
};

export function TaxonRankCell({ cell, value }) {
  return (
    <Box style={{ paddingLeft: cell.row.original.rankValue * 10 - 10 }}>
      <Box
        bg={POSITION_COLOR[cell.row.original.position]}
        p={2}
        cursor="pointer"
        onClick={() => emit(TAXON.SELECTED, cell.row.original.id)}
        borderRadius="md"
      >
        {value}
      </Box>
    </Box>
  );
}
