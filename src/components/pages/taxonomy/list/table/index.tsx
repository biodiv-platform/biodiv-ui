import { Box, Spinner } from "@chakra-ui/react";
import { BasicTable } from "@components/@core/table";
import styled from "@emotion/styled";
import React from "react";

import useTaxonFilter from "../use-taxon";
import { TaxonRankCell } from "./taxon-rank-cell";

const TaxonBox = styled.div`
  thead td {
    position: sticky;
    top: 0;
    background: white;
    box-shadow: 0px 0px 2px var(--chakra-colors-gray-300);
  }
`;

const taxonListRows = [
  {
    Header: "ID",
    accessor: "id",
    isNumeric: true,
    style: { width: "100px" }
  },
  {
    Header: "Rank",
    accessor: "rank",
    Cell: TaxonRankCell,
    style: { paddingTop: 0, paddingBottom: 0 }
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Status",
    accessor: "status"
  },
  {
    Header: "Position",
    accessor: "position"
  }
];

export default function TaxonListTable() {
  const { taxonListData, isLoading, setSelectedTaxons } = useTaxonFilter();

  return (
    <Box
      as={TaxonBox}
      maxH="full"
      w="full"
      id="items-container"
      overflowY="auto"
      gridColumn={{ lg: "4/15" }}
    >
      {isLoading ? (
        <Spinner m={4} />
      ) : (
        <BasicTable
          data={taxonListData.l}
          columns={taxonListRows}
          isSelectable={true}
          onSelectionChange={setSelectedTaxons}
        />
      )}
    </Box>
  );
}
