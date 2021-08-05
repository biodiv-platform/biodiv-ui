import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { DOUCMENT_FILTER_KEY } from "@static/document";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function TitleFilter() {
  return (
    <CheckboxFilterPanel
      filterKey={DOUCMENT_FILTER_KEY.title.filterKey}
      filterKeyList={DOUCMENT_FILTER_KEY}
      useIndexFilter={useDocumentFilter}
      translateKey="filters:document_title"
    />
  );
}
