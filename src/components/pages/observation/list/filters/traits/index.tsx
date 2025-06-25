import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";

export default function TraitsFilter() {
  const { observationData } = useObservationFilter();

  return Object.keys(observationData.ag.groupTraits||{}).length ? (
    <SubAccordion>
      {Object.keys(observationData.ag.groupTraits||{}).map((trait) => (
        <CheckboxFilterPanel
          key={trait.split("|")[1]}
          label={trait.split("|")[0]}
          filterKey={`trait_${trait.split("|")[1]}.string`}
          options={Object.keys(observationData.ag.groupTraits?.[trait] || {}).map(
            (value) => ({ value })
          )}
          statKey={`groupTraits.${trait.split("|")[0]}|${trait.split("|")[1]}`}
          skipOptionsTranslation={true}
        />
      ))}
    </SubAccordion>
  ) : null;
}
