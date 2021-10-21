import { Box, Button, Flex } from "@chakra-ui/react";
import { BasicTable } from "@components/@core/table";
import styled from "@emotion/styled";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useTaxonFilter from "../use-taxon";
import { TaxonNameCell, TaxonRankCell } from "./taxon-rank-cell";

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
    Header: "Name",
    accessor: "name",
    Cell: TaxonNameCell,
    style: { paddingTop: 0, paddingBottom: 0 }
  },
  {
    Header: "Rank",
    accessor: "rank",
    Cell: TaxonRankCell
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
  const { t } = useTranslation();
  const { taxonListData, isLoading, setSelectedTaxons, nextPage } = useTaxonFilter();

  return (
    <Box
      as={TaxonBox}
      maxH="full"
      w="full"
      id="items-container"
      overflowY="auto"
      gridColumn={{ lg: "4/15" }}
    >
      {taxonListData.l.length > 0 && (
        <BasicTable
          data={taxonListData.l}
          columns={taxonListRows}
          isSelectable={true}
          size="sm"
          onSelectionChange={setSelectedTaxons}
        />
      )}
      <Flex alignItems="center" justifyContent="center" p={4}>
        <Button
          isLoading={isLoading}
          disabled={taxonListData.hasMore}
          loadingText={t("common:loading")}
          onClick={nextPage}
          colorScheme="blue"
        >
          {t("common:load_more")}
        </Button>
      </Flex>
    </Box>
  );
}
