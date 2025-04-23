import { Box, Button, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { toaster } from "@/components/ui/toaster";

import StackedHorizontalChart from "./stacked-horizontal-chart";

const TemporalObservedOn = ({ data, isLoading }) => {
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);

  const chartRef = useRef<any>(null);

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
      toaster.create({
        title: "Error while downloading",
        type: "error",
        closable: true
      });
    }
  };

  if (isLoading) {
    return <Skeleton h={450} borderRadius="md" mb={4} />;
  }

  if (!data || Object.keys(data).length == 0) {
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
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box p={4}>
        <Box marginLeft="45%" paddingTop="25px" paddingBottom="25px">
          <NativeSelectRoot
            fontSize="13px"
            maxW="7rem"
            defaultValue={currentIndex}
            onChange={handleOnChange}
          >
            <NativeSelectField>
              {years.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>
        <StackedHorizontalChart data={data[years[currentIndex]]} ref={chartRef} isStacked={true} />
      </Box>
    </Box>
  );
};

export default TemporalObservedOn;
