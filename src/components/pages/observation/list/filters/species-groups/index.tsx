import { CheckboxGroup, SimpleGrid } from "@chakra-ui/core";
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
    <CheckboxGroup defaultValue={stringToArray(filter.sGroup)} onChange={onChange}>
      <SimpleGrid gridGap={2} columns={5} className="custom-checkbox-group">
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
      </SimpleGrid>
    </CheckboxGroup>
  );
};

export default SpeciesGroupsFilter;
