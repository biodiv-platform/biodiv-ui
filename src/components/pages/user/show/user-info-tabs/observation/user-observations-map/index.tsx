import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import ClusterMap from "@components/pages/observation/show/sidebar/cluster-map";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function UserObservationsMap({ userId }) {
  const { t } = useTranslation();

  return (
    <Box className="white-box">
      <BoxHeading>🗺️ {t("USER.OBSERVATIONS.MAP")}</BoxHeading>
      <ClusterMap filter={{ authorId: userId }} borderRadius={0} />
    </Box>
  );
}
