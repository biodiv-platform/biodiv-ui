import { SimpleGrid } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import TableTotals from "./table-totals";

const Totals = ({ filter, observationData, speciesGroup, totalCounts, isLoading }) => {
  //const { totalsData } = useTotals({ filter });
  const { t } = useTranslation();

  const s = useMemo(() => {
    if (!filter.sGroup) {
      const sgroups = Object.values(observationData.ag.groupSpeciesName);
      return sgroups.reduce((a: number, b: number) => a + b);
    }

    const filteredGroups = speciesGroup.filter((sg) => filter.sGroup.includes(sg.id));

    const filteredCounts = filteredGroups.map(
      (v) => observationData.ag.groupSpeciesName[v.name] || 0
    );

    return filteredCounts.reduce((a, b) => a + b);
  }, [filter, observationData]);

  const totals = { totalObservations: s, ...totalCounts };

  return (
    <SimpleGrid columns={{ md: 4 }} spacing={4} mb={4}>
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
