import { SimpleGrid } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import TableTotals from "./table-totals";
import useTotals from "./use-totals";

const Totals = ({ filter, observationData }) => {
  const { totalsData } = useTotals({ filter });
  const { t } = useTranslation();

  const s = useMemo(() => {
    if (!filter.sGroup) {
      const sgroups = Object.values(observationData.ag.groupSpeciesName);
      return sgroups.reduce((a: number, b: number) => a + b);
    }

    const sGroupArray = Array.isArray(filter.sGroup) ? filter.sGroup : [filter.sGroup];

    const filteredGroups = Object.keys(observationData.ag.groupSpeciesName).filter((sg) => {
      const id = sg.split("|")[0];
      return sGroupArray.includes(id);
    });

    return filteredGroups
      .map((key) => observationData.ag.groupSpeciesName[key] || 0)
      .reduce((a, b) => a + b, 0);
  }, [filter.sGroup, observationData.ag.groupSpeciesName]);

  const totals = { totalObservations: s, ...totalsData.data.list };
  const isLoading = totalsData.data.isLoading;

  return (
    <SimpleGrid columns={{ md: 4 }} gap={4} mb={4}>
      <TableTotals
        title={t("observation:list.stats_bar.total_observations")}
        count={totals["totalObservations"]}
        isLoading={isLoading}
      />
      <TableTotals
        title={t("observation:list.stats_bar.total_taxa")}
        count={totals["totalTaxa"]}
        isLoading={isLoading}
      />
      <TableTotals
        title={t("observation:list.stats_bar.total_uploaders")}
        count={totals["totalUploaders"]}
        isLoading={isLoading}
      />
      <TableTotals
        title={t("observation:list.stats_bar.total_identifiers")}
        count={totals["totalIdentifiers"]}
        isLoading={isLoading}
      />
    </SimpleGrid>
  );
};

export default Totals;
