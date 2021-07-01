import { DOCUMNET_ITEM_TYPE } from "@static/document";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function ItemTypeFilter() {
  const itemTypeList = DOCUMNET_ITEM_TYPE?.map((i) => ({
    label: i,
    value: i
  }));

  return (
    <CheckboxFilterPanel
      translateKey="filters:item_type."
      filterKey="itemType"
      options={itemTypeList}
      statKey="groupTypeOfDocument"
      skipOptionsTranslation={true}
    />
  );
}
