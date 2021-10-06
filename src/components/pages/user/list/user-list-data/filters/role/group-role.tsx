import useUserFilter from "@components/pages/user/common/use-user-filter";
import { covertToSentenceCase } from "@utils/text";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function GroupRoleFilter() {
  const {
    userListData: {
      ag: { role }
    }
  } = useUserFilter();

  const OPTIONS = Object.keys(role)?.map((val) => ({
    label: covertToSentenceCase(val),
    value: val,
    stat: role[val]
  }));

  return (
    <CheckboxFilterPanel
      translateKey="filters:user.group_role_"
      filterKey="role"
      options={OPTIONS}
      statKey="role"
      showStat={false}
      skipOptionsTranslation={true}
      showSearch={false}
    />
  );
}
