import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import SITE_CONFIG from "@configs/site-config";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";
import MapAreaFilter from "./map-area";

export default function LocationFilter() {
  const {
    protectedAreas,
    documentData: {
      ag: { groupState }
    }
  } = useDocumentFilter();

  const STATE_OPTIONS = protectedAreas?.map((state) => ({
    label: state.shortName,
    value: state.shortName,
    stat: groupState[state?.shortName]
  }));

  return (
    <SubAccordion>
      <MapAreaFilter />

      {SITE_CONFIG.LANDSCAPE.ACTIVE && (
        <CheckboxFilterPanel
          translateKey="filters:location.protected_area."
          filterKey="state"
          options={STATE_OPTIONS}
          statKey="groupState"
          skipOptionsTranslation={true}
          showSearch={true}
        />
      )}
    </SubAccordion>
  );
}
