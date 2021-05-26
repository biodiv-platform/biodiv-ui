import { Button } from "@chakra-ui/button";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import useTranslation from "@hooks/use-translation";
import React from "react";

import { SpeciesCreateCommonTableRows } from "../common-table-rows";
import useSpeciesCreate from "../create/use-species-create";

export default function SpeciesTaxonMatched() {
  const { setSelectedTaxon, validateResponse } = useSpeciesCreate();
  const { t } = useTranslation();

  const SpeciesSuggestionTable = [
    ...SpeciesCreateCommonTableRows,
    {
      Header: "Actions",
      accessor: "taxonomyDefinition.nameSourceId",
      Cell: ({
        cell: {
          row: { original }
        }
      }) => (
        <Button
          variant="link"
          colorScheme="blue"
          rightIcon={<ArrowForwardIcon />}
          onClick={() => setSelectedTaxon(original.taxonomyDefinition)}
        >
          {t("SPECIES.CREATE.FORM.USE_TAXON")}
        </Button>
      )
    }
  ];

  return (
    <ResponsiveContainer>
      <BasicTable data={validateResponse.matched || []} columns={SpeciesSuggestionTable} />
    </ResponsiveContainer>
  );
}
