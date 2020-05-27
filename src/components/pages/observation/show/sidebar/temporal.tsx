import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@configs/i18n/useTranslation";
import MONTHS from "@static/months";
import dynamic from "next/dynamic";
import React from "react";
import LazyLoad from "react-lazyload";

const Chart: any = dynamic(() => import("react-charts").then((d) => d.Chart), { ssr: false });

export default function Temporal({ data }) {
  const { t } = useTranslation();

  const temporalData = React.useMemo(
    () => [
      {
        label: t("OBSERVATION.TEMPORAL.OBSERVATIONS"),
        data: MONTHS.map((name) => [name, data[name] || 0])
      }
    ],
    []
  );

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📊 {t("OBSERVATION.TEMPORAL.TITLE")}</BoxHeading>
      <LazyLoad height={160} once={true}>
        <Box p={4} className="fade" w="full" h="160px">
          <Chart
            data={temporalData}
            series={{
              type: "bar"
            }}
            tooltip={true}
            axes={[
              { primary: true, type: "ordinal", position: "bottom" },
              { position: "left", type: "linear", stacked: true }
            ]}
          />
        </Box>
      </LazyLoad>
    </Box>
  );
}
