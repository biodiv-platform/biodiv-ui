import React, { useMemo } from "react";
import TableTotals from "./table-totals";
import useTotals from "./use-totals";

const Totals = ({ filter, observationData, speciesGroup }) => {
  const { totalsData } = useTotals({ filter });

  const s = useMemo(() => {
    if (!filter.sGroup) {
      const sgroups = Object.values(observationData.ag.groupSpeciesName);
      return sgroups.reduce((a: number, b: number) => a + b);
    }

    const filteredGroups = speciesGroup.filter((sg) => filter.sGroup.includes(sg.id));

    const filteredCounts = filteredGroups.map((v) => observationData.ag.groupSpeciesName[v.name]);
    return filteredCounts.reduce((a, b) => a + b);
  }, [filter, observationData]);

  const totals = { ...totalsData.data.list, totalObservations: s };

  return <TableTotals totals={totals} />;
};

export default Totals;
