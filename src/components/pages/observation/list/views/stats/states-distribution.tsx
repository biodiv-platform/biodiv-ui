import { Box, Button } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import HorizontalBarChart from "@components/charts/horizontal-bar-chart";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useRef } from "react";

import { toaster } from "@/components/ui/toaster";

import { StatesChartMeta } from "./static-data";

const StatesDistribution = ({ observationData, filter }) => {
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
          sourcetype: "Observations",
          notes: "States Distribution"
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

  const filteredStateData = useMemo(() => {
    if (!filter.state) {
      return Object.entries(observationData.ag.groupState)
        .map(([stateName, observations]: [string, number]) => ({ stateName, observations }))
        .sort((a, b) => b.observations - a.observations);
    }

    const states = filter.state.split(",");
    return states
      .map((s) => ({
        stateName: s,
        observations: observationData.ag.groupState[s]
      }))
      .sort((a, b) => b.observations - a.observations);
  }, [filter, observationData]);

  return filteredStateData.length > 0 ? (
    <Box className="white-box" mb={4}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.states")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>{" "}
      </BoxHeading>
      <Box p={4}>
        <HorizontalBarChart
          data={filteredStateData}
          meta={StatesChartMeta}
          barPadding={0.1}
          h={500}
          mt={10}
          mr={145}
          mb={10}
          ml={58}
          leftOffset={50}
          displayCountKey={false}
          ref={chartRef}
        />
      </Box>
    </Box>
  ) : null;
};

export default StatesDistribution;
