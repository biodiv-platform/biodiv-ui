import useUserFilter from "@components/pages/user/common/use-user-filter";
import { covertToSentenceCase } from "@utils/text";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function InstituteFilter() {
  const {
    userListData: {
      ag: { institution }
    }
  } = useUserFilter();

  const STATE_OPTIONS = Object.keys(institution)?.map((val) => ({
    label: covertToSentenceCase(val),
    value: val,
    stat: institution[val]
  }));

  return (
    <CheckboxFilterPanel
      translateKey="filters:user.institution_"
      filterKey="institution"
      options={STATE_OPTIONS}
      statKey="institution"
      skipOptionsTranslation={true}
      showSearch={true}
    />
  );
}
