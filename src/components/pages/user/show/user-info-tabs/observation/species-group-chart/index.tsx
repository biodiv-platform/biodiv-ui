import { Box, Button } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import StackedBarChart from "@components/charts/stacked-bar-chart";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef } from "react";

import { toaster } from "@/components/ui/toaster";

import { ChartMeta, TooltipRenderer } from "./data";

export default function SpeciesGroupChart({ data }) {
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
          notes: "Group by Species Group"
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

  return (
    <Box className="white-box">
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("user:observations.chart")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
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
