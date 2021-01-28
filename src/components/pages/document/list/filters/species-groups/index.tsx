import { SimpleGrid, useCheckboxGroup } from "@chakra-ui/react";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { stringToArray } from "@utils/basic";
import React, { useMemo } from "react";

import CustomCheckbox from "./checkbox";

const SpeciesGroupsFilter = () => {
  const {
    species,
    filter,
    setFilter,
    documentData: {
      ag: { groupSpeciesName }
    }
  } = useDocumentFilter();

  const speciesMapper = () => {
    return species
      ?.reduce((acc, item) => {
        if (groupSpeciesName[item.id]) {
          acc.push({ ...item, agg: groupSpeciesName[item.id] });
        } else {
          acc.push({ ...item, agg: 0 });
        }
        return acc;
      }, [])
      .sort((a, b) => a.order - b.order);
  };

  const defaultValue = useMemo(() => stringToArray(filter.sGroup), []);
  const speciesGroupList = useMemo(() => speciesMapper(), [species]);

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
            stat={o.agg} //replace with ag stats
            {...getCheckboxProps({ value: o.id.toString() })}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default SpeciesGroupsFilter;
