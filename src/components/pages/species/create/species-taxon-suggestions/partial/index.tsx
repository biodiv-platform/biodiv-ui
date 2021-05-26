import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import useTranslation from "@hooks/use-translation";
import { axSaveTaxonomy } from "@services/species.service";
import notification from "@utils/notification";
import React, { useState } from "react";

import { SpeciesCreateCommonTableRows } from "../common-table-rows";
import useSpeciesCreate from "../create/use-species-create";

export default function SpeciesTaxonPartial() {
  const { validateResponse, validationParams, setSelectedTaxon } = useSpeciesCreate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>();

  const createPartialTaxon = async (ranks) => {
    setIsLoading(true);
    const { success, data } = await axSaveTaxonomy({
      scientificName: validationParams.speciesName,
      rank: validationParams.rank,
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
          variant="link"
          colorScheme="blue"
          disabled={isLoading}
          rightIcon={<ArrowForwardIcon />}
          onClick={() => createPartialTaxon(original.registry)}
        >
          {t("SPECIES.CREATE.FORM.SELECT")}
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
