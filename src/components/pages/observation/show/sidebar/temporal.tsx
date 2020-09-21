import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@hooks/use-translation";
import MONTHS from "@static/months";
import React from "react";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";

export default function Temporal({ data }) {
  const { t } = useTranslation();

  const temporalData = React.useMemo(
    () => MONTHS.map((name) => ({ x: name, y: data[name] || 0 })).reverse(),
    []
  );

  const getLabel = ({ datum }) => `${datum.y} ${t("OBSERVATION.TEMPORAL.OBSERVATIONS")}`;

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📊 {t("OBSERVATION.TEMPORAL.TITLE")}</BoxHeading>
      <Box px={4} className="fade" w="full">
        <VictoryChart
          domainPadding={{ x: 30 }}
          height={380}
          horizontal={true}
          padding={{ left: 80, right: 110 }}
        >
          <VictoryBar
            style={{ data: { fill: "var(--blue-500)" } }}
            barRatio={0.9}
            labels={getLabel}
            data={temporalData}
          />
          <VictoryAxis />
        </VictoryChart>
      </Box>
    </Box>
  );
}
