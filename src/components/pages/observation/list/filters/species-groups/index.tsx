import { CheckboxGroup } from "@chakra-ui/core";
import useObservationFilter from "@hooks/useObservationFilter";
import { stringToArray } from "@utils/basic";
import React from "react";

import CustomCheckbox from "./checkbox";

const SpeciesGroupsFilter = () => {
  const { speciesGroup, filter, setFilter, observationData } = useObservationFilter();

  const onChange = (v) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      if (v.length > 0) {
        _draft.f.sGroup = v.toString();
      } else {
        delete _draft.f.sGroup;
      }
    });
  };

  return (
    <CheckboxGroup
      defaultValue={stringToArray(filter.sGroup)}
      onChange={onChange}
      display="grid"
      className="custom-checkbox-group"
      gridGap={2}
      gridTemplateColumns="repeat(5,1fr)"
    >
      {speciesGroup
        .slice(1)
        .sort((a, b) => a.order - b.order)
        .map((o) => (
          <CustomCheckbox
            key={o.id}
            id={o.id.toString()}
            value={o.id.toString()}
            label={o.name}
            stat={observationData.ag.groupSpeciesName[o.name]}
          />
        ))}
    </CheckboxGroup>
  );
};

export default SpeciesGroupsFilter;
