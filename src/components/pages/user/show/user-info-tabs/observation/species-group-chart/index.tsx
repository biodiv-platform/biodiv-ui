import { Box } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import StackedBarChart from "@components/charts/stacked-bar-chart";
import useTranslation from "@hooks/use-translation";
import React from "react";

import { ChartMeta, TooltipRenderer } from "./data";

export default function SpeciesGroupChart({ data }) {
  const { t } = useTranslation();

  return (
    <Box className="white-box" p={4}>
      <PageHeading size="md">📊 {t("USER.OBSERVATIONS.CHART")}</PageHeading>
      <StackedBarChart
        data={data}
        meta={ChartMeta}
        tooltipRenderer={TooltipRenderer}
        rotateLabels={true}
      />
    </Box>
  );
}
