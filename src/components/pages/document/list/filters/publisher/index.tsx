import { DOUCMENT_FILTER_KEY } from "@static/document";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function PublisherFilter() {
  return (
    <CheckboxFilterPanel
      filterKey={DOUCMENT_FILTER_KEY.publisher.filterKey}
      fullTextSearch={false}
      translateKey="DOCUMENT.BIB.PUBLISHER"
    />
  );
}
