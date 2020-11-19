import { SimpleGrid, useCheckboxGroup } from "@chakra-ui/react";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { stringToArray } from "@utils/basic";
import React, { useMemo } from "react";

import CustomCheckbox from "./checkbox";

const SpeciesGroupsFilter = () => {
  const { species, filter, setFilter } = useDocumentFilter();

  const defaultValue = useMemo(() => stringToArray(filter.sGroup), []);
  const speciesGroupList = useMemo(
    () => species?.slice(1).sort((a, b) => a.order - b.order),
    species
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
            id={o.id.toString()}
            label={o.name}
            stat={0} //replace with ag stats
            {...getCheckboxProps({ value: o.id.toString() })}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default SpeciesGroupsFilter;
