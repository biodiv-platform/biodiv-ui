import { DOUCMENT_FILTER_KEY } from "@static/document";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function TagFilter() {
  return (
    <CheckboxFilterPanel filterKey={DOUCMENT_FILTER_KEY.tags.filterKey} translateKey="form:tags" />
  );
}
