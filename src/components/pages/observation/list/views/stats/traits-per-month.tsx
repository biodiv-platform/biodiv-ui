import { Box, Button, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef } from "react";

import LineGraph from "./line-graph";

const TraitsPerMonth = ({ data, isLoading }) => {
  const { t } = useTranslation();
  const chartRef = useRef<any>(null);

  const handleDownload = async () => {
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
  };
  if (isLoading) {
    return <Skeleton h={450} borderRadius="md" />;
  }

  if (!data || data.length==0) {
    return <div></div>;
  }

  data = data.slice().reverse();

  return (
    <Box className="white-box" mb={4}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.traitsDistribution")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box position={"relative"}>
        <LineGraph data={data} ref={chartRef} />
      </Box>
    </Box>
  );
};

export default TraitsPerMonth;
