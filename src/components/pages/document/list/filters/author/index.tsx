import { DOUCMENT_FILTER_KEY } from "@static/document";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function AuthorFilter() {
  return (
    <CheckboxFilterPanel
      filterKey={DOUCMENT_FILTER_KEY.author.filterKey}
      fullTextSearch={false}
      translateKey="DOCUMENT.BIB.AUTHOR"
    />
  );
}
