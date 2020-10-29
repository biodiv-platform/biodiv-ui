import { Box } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import ClusterMap from "@components/pages/observation/show/sidebar/cluster-map";
import SITE_CONFIG from "@configs/site-config.json";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function UserObservationsMap({ userId }) {
  const { t } = useTranslation();

  return (
    <Box className="white-box">
      <PageHeading size="md" p={4} pb={0}>
        🗺️ {t("USER.OBSERVATIONS.MAP")}
      </PageHeading>
      <ClusterMap
        filter={{ userId }}
        latitude={SITE_CONFIG.MAP.CENTER.latitude}
        longitude={SITE_CONFIG.MAP.CENTER.longitude}
        borderRadius={0}
      />
    </Box>
  );
}
