import useUserFilter from "@components/pages/user/common/use-user-filter";
import { covertToSentenceCase } from "@utils/text";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function RoleFilter() {
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
      translateKey="filters:user_role"
      filterKey="role"
      options={OPTIONS}
      statKey="role"
      skipOptionsTranslation={true}
      showSearch={true}
    />
  );
}
