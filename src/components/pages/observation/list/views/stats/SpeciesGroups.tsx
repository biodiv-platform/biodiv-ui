import React, { useMemo } from "react";

import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";

import VerticalBarChart from "./VertcalBarChart";
import { TooltipRenderer } from "./TooltipRenderer";

export default function SpeciesGroups({ observationData, speciesGroup, filter }) {
  const filteredData2 = useMemo(() => {
    if (!filter.sGroup) {
      if (!observationData.ag.groupSpeciesName) {
        return;
      }
      const sgroups = Object.keys(observationData.ag.groupSpeciesName);
      const ans = sgroups.map((v) => ({
        sgroup: v,
        count: observationData.ag.groupSpeciesName[v]
      }));

      return ans;
    }

    const filteredGroups = speciesGroup.filter((sg) => filter.sGroup.includes(sg.id));

    const filteredData = filteredGroups.map((sg) => ({
      sgroup: sg.name,
      count: observationData.ag.groupSpeciesName[sg.name]
    }));

    return filteredData;
  }, [filter.sGroup, observationData.ag.groupSpeciesName]);

  return (
    <div>
      <Box className="white-box">
        <BoxHeading> Species Groups</BoxHeading>
        <Box p={4}>
          <VerticalBarChart data={filteredData2} tooltipRenderer={TooltipRenderer} />
        </Box>
      </Box>
    </div>
  );
}
