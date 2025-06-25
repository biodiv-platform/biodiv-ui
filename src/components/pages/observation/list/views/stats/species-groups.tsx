import { Box, Button, useToast } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useRef } from "react";

import { SpeciesTooltipRenderer } from "./static-data";
import VerticalBarChart from "./vertcal-bar-chart";

const SpeciesGroups = ({ observationData, filter }) => {
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
          sourcetype: "Observations",
          notes: "Species Groups"
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

  const filteredData = useMemo(() => {
    if (!filter.sGroup) {
      const sgroups = Object.keys(observationData.ag.groupSpeciesName);
      return sgroups.map((v) => ({
        sgroup: v.split("|")[1],
        count: observationData.ag.groupSpeciesName[v]
      }));
    }

    const sGroupArray = Array.isArray(filter.sGroup) ? filter.sGroup : [filter.sGroup];

    const filteredGroups = Object.keys(observationData.ag.groupSpeciesName).filter((sg) => {
      const id = sg.split("|")[0];
      return sGroupArray.includes(id);
    });

    return filteredGroups.map((sg) => ({
      sgroup: sg.split("|")[1],
      count: observationData.ag.groupSpeciesName[sg]
    }));
  }, [filter, observationData]);

  return filteredData.length > 0 ? (
    <Box className="white-box">
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.sgroup")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorScheme="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box p={4}>
        <VerticalBarChart
          h={365}
          data={filteredData}
          tooltipRenderer={SpeciesTooltipRenderer}
          ref={chartRef}
        />
      </Box>
    </Box>
  ) : null;
};

export default SpeciesGroups;
