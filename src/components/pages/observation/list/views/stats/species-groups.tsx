import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@hooks/use-translation";
import React, { useMemo } from "react";

import { SpeciesTooltipRenderer } from "./static-data";
import VerticalBarChart from "./vertcal-bar-chart";

const SpeciesGroups = ({ observationData, speciesGroup, filter }) => {
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

  const { t } = useTranslation();

  return (
    <div>
      <Box className="white-box">
        <BoxHeading>{t("LIST.CHART.SGROUP")}</BoxHeading>
        <Box p={4}>
          <VerticalBarChart data={filteredData} tooltipRenderer={SpeciesTooltipRenderer} />
        </Box>
      </Box>
    </div>
  );
};

export default SpeciesGroups;
