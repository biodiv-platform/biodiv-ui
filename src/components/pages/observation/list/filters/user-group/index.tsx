import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import React, { useMemo } from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function UserGroupFilter() {
  const { currentGroup, groups } = useGlobalState();
  const groupOptions = useMemo(
    () => groups?.map((g) => ({ label: g.name, value: g.id?.toString(), stat: g.name })),
    []
  );

  return !currentGroup?.id && SITE_CONFIG.USERGROUP.ACTIVE ? (
    <CheckboxFilterPanel
      filterKey="userGroupList"
      options={groupOptions}
      showSearch={true}
      skipOptionsTranslation={true}
      statKey="groupUserGroupName"
      translateKey="filters:usergroup."
    />
  ) : null;
}
