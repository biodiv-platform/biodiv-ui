import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import MONTHS from "@static/months";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import StackedHorizontalChart from "../../list/views/stats/stacked-horizontal-chart";

export default function Temporal({ data }) {
  const { t } = useTranslation();

  const temporalData = React.useMemo(
    () =>
      MONTHS.map(({ label, value }) => ({
        Month: t(label).substring(0, 3),
        value: data[value] || 0
      })),
    []
  );

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📊 {t("common:temporal.title")}</BoxHeading>
      <Box px={4} className="fade" w="full">
        <StackedHorizontalChart data={temporalData} isStacked={false} h={300} />
      </Box>
    </Box>
  );
}
