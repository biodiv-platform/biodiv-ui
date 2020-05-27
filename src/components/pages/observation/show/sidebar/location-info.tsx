import { Box, SimpleGrid, Text } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@configs/i18n/useTranslation";
import { ObservationLocationInfo } from "@interfaces/observation";
import { titleCase } from "@utils/basic";
import React from "react";

interface ILocationInformationProps {
  layerInfo: ObservationLocationInfo;
  latitude: number;
  longitude: number;
  geoprivacy: boolean;
}

export default function LocationInformation({
  layerInfo = {},
  latitude,
  longitude,
  geoprivacy = false
}: ILocationInformationProps) {
  const { t } = useTranslation();

  const Row = ({ title, children }) => {
    return (
      <>
        <Text fontWeight={600}>{t(`OBSERVATION.LOCATION_INFORMATION.${title}`)}</Text>
        <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
          {children}
        </Box>
      </>
    );
  };

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>🏜 {t("OBSERVATION.LOCATION_INFORMATION.TITLE")}</BoxHeading>
      <SimpleGrid columns={[1, 1, 3, 3]} spacingY={4} p={4}>
        <Row title="COORDINATES">
          {geoprivacy
            ? t("OBSERVATION.LOCATION_INFORMATION.GEOPRIVACY_ENABLED")
            : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
        </Row>
        <Row title="TAHSIL">{layerInfo.tahsil}</Row>
        <Row title="SOIL">{layerInfo.soil}</Row>
        <Row title="TEMPRATURE">{layerInfo.temp} &deg;C</Row>
        <Row title="RAINFALL">{layerInfo.rainfall} mm</Row>
        <Row title="FOREST_TYPE">{titleCase(layerInfo.forestType)}</Row>
      </SimpleGrid>
    </Box>
  );
}
