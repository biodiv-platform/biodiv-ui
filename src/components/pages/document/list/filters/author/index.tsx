import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { DOUCMENT_FILTER_KEY } from "@static/document";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function AuthorFilter() {
  return (
    <CheckboxFilterPanel
      filterKeyList={DOUCMENT_FILTER_KEY}
      filterKey={DOUCMENT_FILTER_KEY.author.filterKey}
      useIndexFilter={useDocumentFilter}
      translateKey="document:bib.author"
    />
  );
}
