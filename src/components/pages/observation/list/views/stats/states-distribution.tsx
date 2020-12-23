import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import HorizontalBarChart from "@components/charts/horizontal-bar-chart";
import useTranslation from "@hooks/use-translation";
import React, { useMemo } from "react";

import { StatesChartMeta } from "./static-data";

const StatesDistribution = ({ observationData, filter }) => {
  const { t } = useTranslation();

  const filteredStateData = useMemo(() => {
    if (!filter.state) {
      return Object.entries(observationData.ag.groupState)
        .map(([stateName, observations]: [string, number]) => ({ stateName, observations }))
        .sort((a, b) => b.observations - a.observations);
    }

    const states = filter.state.split(",");
    return states
      .map((s) => ({
        stateName: s,
        observations: observationData.ag.groupState[s]
      }))
      .sort((a, b) => b.observations - a.observations);
  }, [filter, observationData]);

  return (
    <Box className="white-box">
      <BoxHeading>{t("LIST.CHART.STATES")}</BoxHeading>
      <Box p={4}>
        <HorizontalBarChart
          data={filteredStateData}
          meta={StatesChartMeta}
          barPadding={0.1}
          h={500}
          mt={10}
          mr={145}
          mb={10}
          ml={58}
          leftOffset={50}
          displayCountKey={false}
        />
      </Box>
    </Box>
  );
};

export default StatesDistribution;
