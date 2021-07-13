import CheckboxFilterPanel from "@components/pages/document/list/filters/shared/multi-select-search";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { OBSERVATION_FILTER_KEY } from "@static/observation-list";
import React from "react";

import SubAccordion from "../shared/sub-accordion";

export default function DatasetFilter() {
  return (
    <SubAccordion>
      <CheckboxFilterPanel
        useIndexFilter={useObservationFilter}
        filterKeyList={OBSERVATION_FILTER_KEY}
        filterKey={OBSERVATION_FILTER_KEY.dataSetName.filterKey}
        translateKey="filters:dataset_filter.dataset.title"
      />
      <CheckboxFilterPanel
        useIndexFilter={useObservationFilter}
        filterKeyList={OBSERVATION_FILTER_KEY}
        filterKey={OBSERVATION_FILTER_KEY.dataTableName.filterKey}
        translateKey="filters:dataset_filter.datatable.title"
      />
    </SubAccordion>
  );
}
