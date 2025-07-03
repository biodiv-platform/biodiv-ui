import { Box, Button, Separator, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { toaster } from "@/components/ui/toaster";

import StackedHorizontalChart from "./stacked-horizontal-chart";
import useTemporalDistributionMonthObserved from "./use-temporal-distribution-month-observed";

const TemporalObservedOn = ({ filter }) => {
  const observedOn = useTemporalDistributionMonthObserved({ filter });
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);

  const chartRef = useRef<any>(null);

  function get50YearIntervalKeys(maxYear, minYear) {
    const intervals: string[] = [];

    maxYear = parseInt(maxYear, 10);
    minYear = parseInt(minYear, 10);

    let end = maxYear;

    while (end >= minYear) {
      const start = Math.max(end - 49, 0); // 50-year span
      const key = `${String(start).padStart(4, "0")}-${String(end).padStart(4, "0")}`;
      intervals.push(key);
      end = start - 1; // next interval block
    }

    return intervals;
  }

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

  if (observedOn.data.isLoading) {
    return <Skeleton h={450} borderRadius="md" mb={4} />;
  }

  if (!observedOn.data.list || Object.keys(observedOn.data.list).length == 0) {
    return <div></div>;
  }

  const years = get50YearIntervalKeys(observedOn.data.maxDate, observedOn.data.minDate);

  const handleOnChange = (e) => {
    const v = parseInt(e?.target?.value, 10);
    observedOn.loadMore(years[v]);
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
      <Separator />
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
        <StackedHorizontalChart
          data={observedOn.data.list[years[currentIndex]] || []}
          ref={chartRef}
          isStacked={true}
        />
      </Box>
    </Box>
  );
};

export default TemporalObservedOn;
