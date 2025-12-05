import { Box, Button, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import LineGraph from "./line-graph";
import useTraitsDistributionData from "./use-traits-distribution-data";

interface TraitsPerMonthProps {
  filter: any;
}

const TraitsPerMonth = forwardRef(({ filter }: TraitsPerMonthProps, ref) => {
  const traits = useTraitsDistributionData({ filter });
  const { t } = useTranslation();
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    base64: () => {
      if (chartRef.current) {
        return chartRef.current.getBase64();
      }
    }
  }));

  const handleDownload = async () => {
    try {
      await waitForAuth();
      if (chartRef.current) {
        chartRef.current.downloadChart();
      }
      const payload = {
        filePath: "",
        filterUrl: window.location.href,
        status: "success",
        fileType: "png",
        sourcetype: "Observations",
        notes: "Traits Distribution"
      };
      axAddDownloadLog(payload);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (traits.data.isLoading) {
    return <Skeleton h={450} borderRadius="md" />;
  }

  if (!traits.data.list || traits.data.list.length == 0) {
    return <div></div>;
  }

  const reversedList = traits.data.list.slice().reverse();

  return (
    <Box ref={containerRef} className="white-box" mb={4}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.traitsDistribution")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box position={"relative"}>
        <LineGraph data={reversedList} ref={chartRef} />
      </Box>
    </Box>
  );
});

export default TraitsPerMonth;
