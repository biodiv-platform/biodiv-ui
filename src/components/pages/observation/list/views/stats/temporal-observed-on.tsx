
import { Box, Button, Select, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/observation.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";

import StackedHorizontalChart from "./stacked-horizontal-chart";
import useObservationPerMonth from "./use-observation-per-month";

const TemporalObservedOn = ({ filter }) => {

  const { t } = useTranslation();
  const count = useObservationPerMonth({ filter });

  const [currentIndex, setCurrentIndex] = useState(0);

  const chartRef = useRef<any>(null);

  const handleDownload = async() => {
    await waitForAuth();
    if (chartRef.current) {
      chartRef.current.downloadChart();
    }
    axAddDownloadLog(window.location.href,"Temporal Distribution - Month Observed")
  };

  const data = count.data.list;
  const isLoading = count.data.isLoading;

  if (isLoading) {
    return <Skeleton h={450} borderRadius="md" />;
  }

  if (!data) {
    return <div></div>;
  }

  const years = Object.keys(data);
  years.reverse()

  const handleOnChange = (e) => {
    const v = e?.target?.value;
    setCurrentIndex(v)
  };

  return (
      <Box className="white-box" mb={4}>
        <BoxHeading styles={{display:"flex",justifyContent:"space-between"}}>📊 {t("observation:list.chart.temporal_distribution_date_observed")} <Button onClick={handleDownload} variant="ghost" colorScheme="blue"><DownloadIcon/></Button></BoxHeading>
      <Box p={4}>
      <div style={{marginLeft:"45%", paddingTop:"25px", paddingBottom:"25px"}}>
          <Select
            fontSize="13px"
            maxW="7rem"
            value={currentIndex}
            onChange={handleOnChange}
          >
            {years.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <StackedHorizontalChart data={data[years[currentIndex]]} ref={chartRef}/>
      </Box>
    </Box>
  );
};

export default TemporalObservedOn;