
import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import StackedHorizontalChart from "./stacked-horizontal-chart";
import useObservationPerMonth from "./use-observation-per-month";

const TemporalObservedOn = ({ filter }) => {

  const { t } = useTranslation();
  const count = useObservationPerMonth({ filter });

  const data = count.data.list;
  const isLoading = count.data.isLoading;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }


  return (
      <Box className="white-box" mb={4}>
        <BoxHeading>📊 {t("observation:list.chart.temporal_distribution_date_observed")}</BoxHeading>
      <Box p={4}>
        <StackedHorizontalChart data={data}/>
      </Box>
    </Box>
  );
};

export default TemporalObservedOn;