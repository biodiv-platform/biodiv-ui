import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import { ObservationLocationInfo } from "@interfaces/observation";
import { titleCase } from "@utils/basic";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface ILocationInformationProps {
  layerInfo: ObservationLocationInfo;
  latitude?: number;
  longitude?: number;
  geoprivacy?: boolean;
}

export default function LocationInformation({
  layerInfo,
  latitude,
  longitude,
  geoprivacy = false
}: ILocationInformationProps) {
  const { t } = useTranslation();

  const Row = ({ title, children }) => {
    return (
      <>
        <Text fontWeight={600}>{t(`observation:location_information.${title.toLowerCase()}`)}</Text>
        <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
          {children}
        </Box>
      </>
    );
  };

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>🏜 {t("observation:location_information.title")}</BoxHeading>
      <SimpleGrid columns={[1, 1, 3, 3]} spacingY={4} p={4}>
        <Row title="COORDINATES">
          {geoprivacy
            ? t("observation:location_information.geoprivacy_enabled")
            : `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}`}
        </Row>
        {layerInfo.tahsil && <Row title="TEHSIL">{layerInfo.tahsil}</Row>}
        {layerInfo.soil && <Row title="SOIL">{layerInfo.soil}</Row>}
        {layerInfo.temp && <Row title="TEMPERATURE">{layerInfo.temp} &deg;C</Row>}
        {layerInfo.rainfall && <Row title="RAINFALL">{layerInfo.rainfall} mm</Row>}
        {layerInfo.forestType && <Row title="FOREST_TYPE">{titleCase(layerInfo.forestType)}</Row>}
        {layerInfo.protectedAreaName && (
          <Row title="PROTECTED_AREA_NAME">{titleCase(layerInfo.protectedAreaName)}</Row>
        )}
        {layerInfo.province && <Row title="PROVINCE">{titleCase(layerInfo.province)}</Row>}
        {layerInfo.district && <Row title="DISTRICT">{titleCase(layerInfo.district)}</Row>}
      </SimpleGrid>
    </Box>
  );
}
