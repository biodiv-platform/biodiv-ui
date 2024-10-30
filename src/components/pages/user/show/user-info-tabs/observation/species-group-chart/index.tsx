import { Box, Button, useToast } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import StackedBarChart from "@components/charts/stacked-bar-chart";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef } from "react";

import { ChartMeta, TooltipRenderer } from "./data";

export default function SpeciesGroupChart({ data }) {
  const { t } = useTranslation();
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
          sourcetype: "User",
          notes: "Group by Species Group"
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

  return (
    <Box className="white-box">
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("user:observations.chart")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorScheme="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box p={4}>
        <StackedBarChart
          data={data}
          meta={ChartMeta}
          tooltipRenderer={TooltipRenderer}
          rotateLabels={true}
          ref={chartRef}
        />
      </Box>
    </Box>
  );
}
