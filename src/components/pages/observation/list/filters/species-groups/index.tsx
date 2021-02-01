import { SimpleGrid, useCheckboxGroup } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { stringToArray } from "@utils/basic";
import React, { useMemo } from "react";

import CustomCheckbox from "./checkbox";

const SpeciesGroupsFilter = () => {
  const { speciesGroup, filter, setFilter, observationData } = useObservationFilter();

  const defaultValue = useMemo(() => stringToArray(filter?.sGroup), []);
  const speciesGroupList = useMemo(
    () => speciesGroup?.slice(1).sort((a, b) => (a?.order || 0) - (b.order || 0)),
    speciesGroup
  );

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

  const { getCheckboxProps } = useCheckboxGroup({
    defaultValue,
    onChange
  });

  return (
    <>
      <SimpleGrid gridGap={2} columns={5}>
        {speciesGroupList?.map((o) => (
          <CustomCheckbox
            key={o.id}
            id={o.id?.toString()}
            label={o.name}
            stat={o.name ? observationData?.ag?.groupSpeciesName?.[o.name] : 0}
            {...getCheckboxProps({ value: o.id?.toString() })}
          />
        ))}
      </SimpleGrid>
      {/*  */}
      {/* <CheckboxGroup defaultValue={defaultValue} onChange={onChange}>
        <SimpleGrid gridGap={2} columns={5}>
          {speciesGroupList.map((o) => (
            <CustomCheckbox
              key={o.id}
              id={o.id.toString()}
              value={o.id.toString()}
              label={o.name}
              stat={observationData.ag.groupSpeciesName[o.name]}
            />
          ))}
        </SimpleGrid>
      </CheckboxGroup> */}
    </>
  );
};

export default SpeciesGroupsFilter;
