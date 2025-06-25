import { SimpleGrid, useCheckboxGroup } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { stringToArray } from "@utils/basic";
import React, { useMemo } from "react";

import CustomCheckbox from "./checkbox";

const SpeciesGroupsFilter = () => {
  const { filter, setFilter, observationData } = useObservationFilter();

  const defaultValue = useMemo(() => stringToArray(filter?.sGroup), []);
  const speciesGroupList = useMemo(() => {
    return Object.keys(observationData?.ag?.groupSpeciesName || {})
      .filter((o) => o.split("|")[1] !== "All") // removes All from filter explicitly
      .sort(
        (a, b) =>
          parseInt(a.split("|")[2] || "0", 10) -
          parseInt(b.split("|")[2] || "0", 10)
      );
  }, [observationData?.ag?.groupSpeciesName]);

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
    <SimpleGrid gridGap={2} columns={5}>
      {speciesGroupList?.map((o) => (
        <CustomCheckbox
          key={o.split("|")[0]}
          id={o.split("|")[0]?.toString()}
          label={o.split("|")[1]}
          stat={o.split("|")[1] ? observationData?.ag?.groupSpeciesName?.[o] : 0}
          {...getCheckboxProps({ value: o.split("|")[0]?.toString() })}
        />
      ))}
    </SimpleGrid>
  );
};

export default SpeciesGroupsFilter;
