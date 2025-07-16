import { Box, Button, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import StackedHorizontalChart from "@components/pages/observation/list/views/stats/stacked-horizontal-chart";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { toaster } from "@/components/ui/toaster";

import useTemporalData from "./use-temporal-observation-data";

export default function UserTemporalObservedOn(userId) {
  const { t } = useTranslation();
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
          sourcetype: "User",
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
  const temporalData = useTemporalData(userId.userId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const data = temporalData.data.list["observedOn"];
  const isLoading = temporalData.data.isLoading;
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
        📊 {t("user:observations.temporal_month_observed")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box p={4}>
        <Box marginLeft="45%" paddingTop="25px" paddingBottom="25px">
          <NativeSelectRoot
            fontSize="13px"
            maxW="7rem"
            // value={currentIndex}
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
        <StackedHorizontalChart data={data[years[currentIndex]]} isStacked={true} ref={chartRef} />
      </Box>
    </Box>
  );
}
