import useUserFilter from "@components/pages/user/common/use-user-filter";
import { stripSpecialCharacters } from "@utils/text";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function ProfessionFilter() {
  const {
    userListData: {
      ag: { profession }
    }
  } = useUserFilter();

  const OPTIONS = Object.keys(profession)?.map((val) => ({
    label: stripSpecialCharacters(val),
    value: val,
    stat: profession[val]
  }));

  return (
    <CheckboxFilterPanel
      translateKey="filters:user.profession_"
      filterKey="profession"
      options={OPTIONS}
      statKey="profession"
      skipOptionsTranslation={true}
      showSearch={true}
    />
  );
}
