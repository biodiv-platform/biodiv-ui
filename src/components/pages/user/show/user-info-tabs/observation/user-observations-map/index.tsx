import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import ClusterMap from "@components/pages/observation/show/sidebar/cluster-map";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function UserObservationsMap({ userId }) {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();
  const userGroupId = currentGroup?.id || undefined;

  return (
    <Box className="white-box">
      <BoxHeading>🗺️ {t("USER.OBSERVATIONS.MAP")}</BoxHeading>
      <ClusterMap filter={{ authorId: userId, userGroupId }} borderRadius={0} />
    </Box>
  );
}
