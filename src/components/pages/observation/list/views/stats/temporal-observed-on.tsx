
import { Box, Button } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import useTranslation from "next-translate/useTranslation";
import React, { useRef } from "react";

import StackedHorizontalChart from "./stacked-horizontal-chart";
import useObservationPerMonth from "./use-observation-per-month";

const TemporalObservedOn = ({ filter }) => {

  const { t } = useTranslation();
  const count = useObservationPerMonth({ filter });

  const chartRef = useRef<any>(null);

  const handleDownload = () => {
    if (chartRef.current) {
      chartRef.current.downloadChart();
    }
  };

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
        <BoxHeading styles={{display:"flex",justifyContent:"space-between"}}>📊 {t("observation:list.chart.temporal_distribution_date_observed")} <Button onClick={handleDownload} variant="ghost" colorScheme="blue"><DownloadIcon/></Button></BoxHeading>
      <Box p={4}>
        <StackedHorizontalChart data={data} ref={chartRef}/>
      </Box>
    </Box>
  );
};

export default TemporalObservedOn;