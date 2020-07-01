import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import TextFilterPanel from "../shared/search";
import SubAccordion from "../shared/sub-accordion";
import { RECO_NAME, TAXON_RANK_OPTIONS } from "./filter-keys";

export default function NameFilter() {
  return (
    <SubAccordion>
      <TextFilterPanel filterKey="recoName" translateKey="FILTERS.NAME.RECO_NAME." />

      <CheckboxFilterPanel
        translateKey="FILTERS.NAME.STATUS."
        filterKey="status"
        options={RECO_NAME}
        statKey="groupStatus"
      />

      <CheckboxFilterPanel
        translateKey="FILTERS.SCIENTIFIC_NAME.TAXON_RANK."
        filterKey="rank"
        options={TAXON_RANK_OPTIONS}
        statKey="groupRank"
        skipOptionsTranslation={true}
      />
    </SubAccordion>
  );
}
