import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";

export default function TraitsFilter() {
  const { observationData } = useObservationFilter();
  const groupTraits = observationData.ag.groupTraits || {};
  const traitKeys = Object.keys(groupTraits);

  if (!traitKeys.length) return null;

  return Object.keys(observationData.ag.groupTraits || {}).length ? (
    <SubAccordion>
      {traitKeys.map((traitKey) => {
        const [traitName, traitId] = traitKey.split("|");
        const optionsMap = groupTraits[traitKey] || {};
        const options = Object.keys(optionsMap).map((value) => ({
          value,
          stat: `${value}.count`,
          valueIcon: optionsMap[value].valueIcon
        }));

        return (
          <CheckboxFilterPanel
            key={traitId}
            label={traitName}
            filterKey={`trait_${traitId}.string`}
            options={options}
            statKey={`groupTraits.${traitName}|${traitId}`}
            skipOptionsTranslation={true}
          />
        );
      })}
    </SubAccordion>
  ) : null;
}
