import { useBreakpointValue } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import StackedBarChart from "@components/charts/stacked-bar-chart";
import useTranslation from "@hooks/use-translation";
import React from "react";

const speciesDistributionChartMeta = {
  groupKey: "group",
  subGroupKeys: ["identified", "uploaded"],
  subGroupColors: ["#3182CE", "#E53E3E"]
};

const tooltipRenderer = (data) => {
  return `<b>${data[speciesDistributionChartMeta.groupKey]}</b><br/>
    <nobr>Uploaded: ${data?.uploaded}</nobr><br/>
    <nobr>Identified: ${data?.identified}</nobr>`;
};

export default function UploadedChart({ data }) {
  const rotateLabels = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();

  return (
    <>
      <PageHeading size="md">📊 {t("USER.OBSERVATIONS.CHART")}</PageHeading>
      <StackedBarChart
        data={data}
        meta={speciesDistributionChartMeta}
        tooltipRenderer={tooltipRenderer}
        rotateLabels={rotateLabels}
      />
    </>
  );
}
