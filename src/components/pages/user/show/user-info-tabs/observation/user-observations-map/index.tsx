import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import ClusterMap from "@components/pages/observation/show/sidebar/cluster-map";
import SITE_CONFIG from "@configs/site-config.json";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function UserObservationsMap({ userId }) {
  const { t } = useTranslation();

  return (
    <Box className="white-box">
      <BoxHeading>🗺️ {t("USER.OBSERVATIONS.MAP")}</BoxHeading>
      <ClusterMap
        filter={{ userId }}
        latitude={SITE_CONFIG.MAP.CENTER.latitude}
        longitude={SITE_CONFIG.MAP.CENTER.longitude}
        borderRadius={0}
      />
    </Box>
  );
}
