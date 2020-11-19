import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";
import MapAreaFilter from "./map-area";

export default function LocationFilter() {
  const { protectedAreas } = useDocumentFilter();
  const STATE_OPTIONS = protectedAreas?.map((state) => ({
    label: state.shortName,
    value: state.shortName,
    stat: state.shortName
  }));

  return (
    <SubAccordion>
      <MapAreaFilter />

      <CheckboxFilterPanel
        translateKey="FILTERS.LOCATION.PROTECTED_AREA."
        filterKey="state"
        options={STATE_OPTIONS}
        statKey="groupState"
        skipOptionsTranslation={true}
        showSearch={true}
      />
    </SubAccordion>
  );
}
