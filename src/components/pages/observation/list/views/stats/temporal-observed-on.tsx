import { Box, Button, Select, Skeleton, useToast } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";

import StackedHorizontalChart from "./stacked-horizontal-chart";
import useTemporalDistributionMonthObserved from "./use-temporal-distribution-month-observed";

const TemporalObservedOn = ({ filter }) => {
  const { t } = useTranslation();
  const count = useTemporalDistributionMonthObserved({ filter });

  const [currentIndex, setCurrentIndex] = useState(0);

  const chartRef = useRef<any>(null);
  const toast = useToast();

  const handleDownload = async () => {
    try {
      await waitForAuth();
      if (chartRef.current) {
        chartRef.current.downloadChart();
        const payload = {
          filePath: "",
          filterUrl: window.location.href,
          status: "success",
          fileType: "png",
          sourcetype: "Observations",
          notes: "Temporal Distribution - Month Observed"
        };
        axAddDownloadLog(payload);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error while downloading",
        status: "error",
        isClosable: true,
        position: "top"
      });
    }
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
  years.reverse();

  const handleOnChange = (e) => {
    const v = e?.target?.value;
    setCurrentIndex(v);
  };

  return (
    <Box className="white-box" mb={4}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.temporal_distribution_date_observed")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorScheme="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box p={4}>
        <Box marginLeft="45%" paddingTop="25px" paddingBottom="25px">
          <Select fontSize="13px" maxW="7rem" value={currentIndex} onChange={handleOnChange}>
            {years.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </Select>
        </Box>
        <StackedHorizontalChart data={data[years[currentIndex]]} ref={chartRef} />
      </Box>
    </Box>
  );
};

export default TemporalObservedOn;
