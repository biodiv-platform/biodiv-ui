import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";

export default function TraitsFilter() {
  const { traits } = useObservationFilter();

  return traits.length ? (
    <SubAccordion>
      {traits.map((trait) => (
        <CheckboxFilterPanel
          key={trait.id}
          label={trait.name}
          filterKey={`trait_${trait.id}.string`}
          options={trait.traitValues}
          statKey={`groupTraits.${trait.name}`}
          skipOptionsTranslation={true}
        />
      ))}
    </SubAccordion>
  ) : null;
}
