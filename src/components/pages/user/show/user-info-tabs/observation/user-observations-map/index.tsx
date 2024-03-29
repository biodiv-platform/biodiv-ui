import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import ClusterMap from "@components/pages/observation/show/sidebar/cluster-map";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function UserObservationsMap({ userId, groupId }) {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();
  const userGroupId = currentGroup?.id || undefined;

  return (
    <Box className="white-box">
      <BoxHeading>🗺️ {t("user:observations.map")}</BoxHeading>
      <ClusterMap
        filter={{ user: userId, userGroupList: userGroupId, sGroup: groupId }}
        k={groupId}
        borderRadius={0}
      />
    </Box>
  );
}
