import { Button } from "@chakra-ui/react";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import { axSaveTaxonomy } from "@services/taxonomy.service";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { LuMoveRight } from "react-icons/lu";

import { SpeciesCreateCommonTableRows } from "../common-table-rows";
import useSpeciesCreate from "../create/use-species-create";

export default function SpeciesTaxonPartial() {
  const { validateResponse, validationParams, setSelectedTaxon } = useSpeciesCreate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>();

  const createPartialTaxon = async (ranks) => {
    setIsLoading(true);
    const { success, data } = await axSaveTaxonomy({
      scientificName: validationParams.scientificName,
      rank: validationParams.rankName,
      rankToName: Object.fromEntries(ranks.map((rank) => [rank.rank, rank.name])),
      status: "ACCEPTED",
      position: "RAW"
    });
    if (success) {
      setSelectedTaxon(data);
    } else {
      notification("SPECIES.CREATE.ERROR");
    }
    setIsLoading(false);
  };

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
          disabled={isLoading}
          onClick={() => createPartialTaxon(original.registry)}
        >
          {t("species:create.form.select")}
          <LuMoveRight/>
        </Button>
      )
    }
  ];

  return (
    <ResponsiveContainer>
      <BasicTable data={validateResponse?.parentMatched || []} columns={SpeciesSuggestionTable} />
    </ResponsiveContainer>
  );
}
