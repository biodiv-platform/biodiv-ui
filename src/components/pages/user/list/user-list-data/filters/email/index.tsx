import useUserFilter from "@components/pages/user/common/use-user-filter";
import { USER_FILTER_KEY } from "@static/user";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function EmailFilter() {
  return (
    <CheckboxFilterPanel
      filterKey={USER_FILTER_KEY.email.filterKey}
      filterKeyList={USER_FILTER_KEY}
      useIndexFilter={useUserFilter}
      translateKey="filters:user.email"
    />
  );
}
