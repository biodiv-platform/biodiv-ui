import useUserFilter from "@components/pages/user/common/use-user-filter";
import { covertToSentenceCase } from "@utils/text";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function SexTypeFilter() {
  const {
    userListData: {
      ag: { sex }
    }
  } = useUserFilter();

  const OPTIONS = Object.keys(sex)?.map((val) => ({
    label: covertToSentenceCase(val),
    value: val,
    stat: sex[val]
  }));

  return (
    <CheckboxFilterPanel
      translateKey="filters:user.sex_"
      filterKey="sex"
      options={OPTIONS}
      statKey="sex"
      skipOptionsTranslation={true}
      showSearch={true}
    />
  );
}
