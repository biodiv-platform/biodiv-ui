import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import TextFilterPanel from "../shared/search";
import SubAccordion from "../shared/sub-accordion";
import { RECO_NAME, TAXON_RANK_OPTIONS } from "./filter-keys";

export default function NameFilter() {
  return (
    <SubAccordion>
      <TextFilterPanel filterKey="recoName" translateKey="filters:name.reco_name." />

      <CheckboxFilterPanel
        translateKey="filters:name.status."
        filterKey="status"
        options={RECO_NAME}
        statKey="groupStatus"
      />

      <CheckboxFilterPanel
        translateKey="filters:scientific_name.taxon_rank."
        filterKey="rank"
        options={TAXON_RANK_OPTIONS}
        statKey="groupRank"
        skipOptionsTranslation={true}
      />
    </SubAccordion>
  );
}
