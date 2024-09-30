import { Box, Button } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useRef } from "react";

import { SpeciesTooltipRenderer } from "./static-data";
import VerticalBarChart from "./vertcal-bar-chart";

const SpeciesGroups = ({ observationData, speciesGroup, filter }) => {
  const { t } = useTranslation();

  const chartRef = useRef<any>(null);

  const handleDownload = () => {
    if (chartRef.current) {
      chartRef.current.downloadChart();
    }
  };

  const filteredData = useMemo(() => {
    if (!filter.sGroup) {
      const sgroups = Object.keys(observationData.ag.groupSpeciesName);
      return sgroups.map((v) => ({
        sgroup: v,
        count: observationData.ag.groupSpeciesName[v]
      }));
    }

    const filteredGroups = speciesGroup.filter((sg) => filter.sGroup.includes(sg.id));

    return filteredGroups.map((sg) => ({
      sgroup: sg.name,
      count: observationData.ag.groupSpeciesName[sg.name]
    }));
  }, [filter, observationData]);

  return filteredData.length > 0 ? (
    <Box className="white-box">
      <BoxHeading styles={{display:"flex",justifyContent:"space-between"}}>📊 {t("observation:list.chart.sgroup")} <Button onClick={handleDownload} variant="ghost" colorScheme="blue"><DownloadIcon/></Button></BoxHeading>
      <Box p={4}>
        <VerticalBarChart h={365} data={filteredData} tooltipRenderer={SpeciesTooltipRenderer} ref={chartRef}/>
      </Box>
    </Box>
  ) : null;
};

export default SpeciesGroups;
