import { Button } from "@chakra-ui/react";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuMoveRight } from "react-icons/lu";

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
          variant="plain"
          colorPalette="blue"
          onClick={() => setSelectedTaxon(original.taxonomyDefinition)}
        >
          {t("species:create.form.use_taxon")}
          <LuMoveRight />
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
