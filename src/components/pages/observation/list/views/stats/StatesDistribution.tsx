import React, { useMemo } from "react";

import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";

import HorizontalBarChart from "./HorizontalBarChart";

export default function StatesDistribution({ observationData, filter }) {
  const HorizontalChartMeta = {
    titleKey: "stateName",
    countKey: "observations",
    hideXAxis: true
  };

  const filteredStateData = useMemo(() => {
    if (!filter.state) {
      if (!observationData.ag.groupState) {
        return;
      }

      const stateData = Object.entries(observationData.ag.groupState)
        .map(([stateName, observations]: [string, number]) => ({ stateName, observations }))
        .sort((a, b) => b.observations - a.observations);

      return stateData;
    }

    const states = filter.state.split(",");
    const fs = states.map((s) => ({
      stateName: s,
      observations: observationData.ag.groupState[s]
    }));

    fs.sort((a, b) => b.observations - a.observations);

    return fs;
  }, [filter, observationData]);

  return (
    <div>
      <Box className="white-box">
        <BoxHeading>State distribution</BoxHeading>
        <Box p={4}>
          <HorizontalBarChart
            data={filteredStateData}
            meta={HorizontalChartMeta}
            barPadding={0.1}
            mt={10}
            mr={145}
            mb={10}
            ml={58}
          />
        </Box>
      </Box>
    </div>
  );
}
