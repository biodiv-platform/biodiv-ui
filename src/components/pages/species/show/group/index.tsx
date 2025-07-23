import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import GroupPost from "@components/pages/observation/show/groups/group-post";
import useGlobalState from "@hooks/use-global-state";
import { axSaveUserGroups } from "@services/species.service";
import { axGetUserGroupList } from "@services/usergroup.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import useSpecies from "../use-species";

export default function SpeciesGroups() {
  const [userGroups, setUserGroups] = useState([]);
  const { isLoggedIn } = useGlobalState();
  const { t } = useTranslation();
  const { species } = useSpecies();

  useEffect(() => {
    if (isLoggedIn) {
      axGetUserGroupList().then(({ data }) => setUserGroups(data));
    }
  }, [isLoggedIn]);

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>👥 {t("species:groups.title")}</BoxHeading>
      <Box p={4}>
        <GroupPost
          groups={userGroups}
          selectedDefault={species.userGroups?.filter((g) => g?.id != null)}
          resourceId={species.species.id}
          saveUserGroupsFunc={axSaveUserGroups}
          columns={[1, 1, 4, 5]}
        />
      </Box>
    </Box>
  );
}
