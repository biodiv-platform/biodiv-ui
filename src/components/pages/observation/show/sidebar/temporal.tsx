import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import HorizontalBarChart from "@components/charts/horizontal-bar-chart";
import MONTHS from "@static/months";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Temporal({ data }) {
  const { t } = useTranslation();

  const temporalData = React.useMemo(
    () => MONTHS.map(({ label, value }) => ({ Month: t(label), Observations: data[value] || 0 })),
    []
  );

  const ChartMeta = {
    countTitle: t("common:temporal.observations"),
    titleKey: "Month",
    countKey: "Observations",
    hideXAxis: true
  };

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📊 {t("common:temporal.title")}</BoxHeading>
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
