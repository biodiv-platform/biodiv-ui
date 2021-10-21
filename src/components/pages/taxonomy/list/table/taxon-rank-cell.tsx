import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useTaxonFilter from "../use-taxon";
import StatusIcon from "./status-icon";

const POSITION_COLOR = {
  WORKING: "yellow.300",
  CLEAN: "green.300",
  RAW: "gray.300"
};

export function TaxonNameCell({ cell, value }) {
  const { setShowTaxon } = useTaxonFilter();

  return (
    <Box style={{ paddingLeft: cell.row.original.rankValue * 10 - 10 }}>
      <Box
        bg={POSITION_COLOR[cell.row.original.position]}
        pr={2}
        py={2}
        my="0.1rem"
        cursor="pointer"
        onClick={() => setShowTaxon(cell.row.original.id)}
      >
        <StatusIcon status={cell.row.original.status} />
        {value}
      </Box>
    </Box>
  );
}

export function TaxonRankCell({ value }) {
  const { t } = useTranslation();

  return t(`taxon:hierarchy.${value}`);
}
