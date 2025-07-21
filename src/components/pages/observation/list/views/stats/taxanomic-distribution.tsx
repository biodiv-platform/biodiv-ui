import { Box, Button, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";

import { toaster } from "@/components/ui/toaster";

import TreeMapChart from "./tree-map";
import useTaxonTreeData from "./use-taxon-tree-data";

const TaxanomicDistribution = ({ filter }) => {
  const taxon = useTaxonTreeData({ filter });
  const { t } = useTranslation();
  const [currentParent, setCurrentParent] = useState("Root|1");
  const [currentDataPath, setCurrentDataPath] = useState(["Root|1"]);
  useEffect(() => {
    // Whenever `filter` changes, reset both states
    setCurrentParent("Root|1");
    setCurrentDataPath(["Root|1"]);
  }, [filter]);

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
          notes: "Taxonomic Distribution"
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

  const increaseDepth = (data) => {
    setCurrentParent(data);
    taxon.loadMore(data);
    setCurrentDataPath(currentDataPath.concat(data));
  };

  const decrease = (data) => {
    setCurrentParent(data);
    setCurrentDataPath(currentDataPath.slice(0, currentDataPath.indexOf(data) + 1));
  };

  if (taxon.data.isLoading) {
    return <Skeleton h={450} borderRadius="md" mb={4} />;
  }

  if (!taxon.data.list) {
    return <div></div>;
  }

  return (
    <Box className="white-box" mb={4}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.taxonomic_distribution")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box p={4}>
        <TreeMapChart
          data={taxon.data.list}
          ref={chartRef}
          loadMore={increaseDepth}
          currentParent={currentParent}
          currentDataPath={currentDataPath}
          decrease={decrease}
        />
      </Box>
    </Box>
  );
};

export default TaxanomicDistribution;
