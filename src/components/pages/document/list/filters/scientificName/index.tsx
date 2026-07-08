import React from "react";

import { DOUCMENT_FILTER_KEY } from "@/static/document";

import useDocumentFilter from "../../../common/use-document-filter";
import CheckboxFilterPanel from "../shared/multi-select-search";

export default function ScientificNameFilter() {
  return (
    <CheckboxFilterPanel
      filterKey={DOUCMENT_FILTER_KEY.scientificNames.filterKey}
      filterKeyList={DOUCMENT_FILTER_KEY}
      useIndexFilter={useDocumentFilter}
      translateKey="filters:document_title"
    />
  );
}
