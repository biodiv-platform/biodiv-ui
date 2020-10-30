import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import HorizontalBarChart from "@components/charts/horizontal-bar-chart";
import useTranslation from "@hooks/use-translation";
import MONTHS from "@static/months";
import React from "react";

const ChartMeta = {
  titleKey: "Month",
  countKey: "Observations",
  hideXAxis: true
};

export default function Temporal({ data }) {
  const { t } = useTranslation();

  const temporalData = React.useMemo(
    () => MONTHS.map((name) => ({ Month: name, Observations: data[name] || 0 })).reverse(),
    []
  );

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📊 {t("OBSERVATION.TEMPORAL.TITLE")}</BoxHeading>
      <Box px={4} className="fade" w="full">
        <HorizontalBarChart
          data={temporalData}
          meta={ChartMeta}
          barPadding={0.1}
          mt={10}
          mr={80}
          mb={10}
          ml={58}
        />
      </Box>
    </Box>
  );
}
