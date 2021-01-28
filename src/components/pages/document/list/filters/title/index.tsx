import { DOUCMENT_FILTER_KEY } from "@static/document";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function TitleFilter() {
  return (
    <CheckboxFilterPanel
      filterKey={DOUCMENT_FILTER_KEY.title.filterKey}
      translateKey="FILTERS.DOCUMENT_TITLE"
    />
  );
}
