import { useStoreState } from "easy-peasy";
import React, { useMemo } from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function UserGroupFilter() {
  const { currentGroup, groups } = useStoreState((s) => s);
  const groupOptions = useMemo(
    () => groups.map((g) => ({ label: g.name, value: g.id.toString(), stat: g.name })),
    []
  );

  return currentGroup?.id ? null : (
    <CheckboxFilterPanel
      filterKey="userGroupList"
      options={groupOptions}
      showSearch={true}
      skipOptionsTranslation={true}
      statKey="groupUserGroupName"
      translateKey="FILTERS.USERGROUP."
    />
  );
}
