import { Box, Button, Separator, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef } from "react";

import LineGraph from "./line-graph";
import useTraitsDistributionData from "./use-traits-distribution-data";

const TraitsPerMonth = ({ filter }) => {
  const traits = useTraitsDistributionData({ filter });
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
  if (traits.data.isLoading) {
    return <Skeleton h={450} borderRadius="md" />;
  }

  if (!traits.data.list || traits.data.list.length == 0) {
    return <div></div>;
  }

  const reversedList = traits.data.list.slice().reverse();

  return (
    <Box className="white-box" mb={4}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.traitsDistribution")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Separator />
      <Box position={"relative"}>
        <LineGraph data={reversedList} ref={chartRef} />
      </Box>
    </Box>
  );
};

export default TraitsPerMonth;
