import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import StackedBarChart from "@components/charts/stacked-bar-chart";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { ChartMeta, TooltipRenderer } from "./data";

export default function SpeciesGroupChart({ data }) {
  const { t } = useTranslation();

  return (
    <Box className="white-box">
      <BoxHeading>📊 {t("user:observations.chart")}</BoxHeading>
      <Box p={4}>
        <StackedBarChart
          data={data}
          meta={ChartMeta}
          tooltipRenderer={TooltipRenderer}
          rotateLabels={true}
        />
      </Box>
    </Box>
  );
}
