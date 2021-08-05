import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { DOUCMENT_FILTER_KEY } from "@static/document";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function TagFilter() {
  return (
    <CheckboxFilterPanel
      filterKeyList={DOUCMENT_FILTER_KEY}
      useIndexFilter={useDocumentFilter}
      filterKey={DOUCMENT_FILTER_KEY.tags.filterKey}
      translateKey="form:tags"
    />
  );
}
