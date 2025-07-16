import { Stack } from "@chakra-ui/react";
import React from "react";

import useGroupListFilter from "../use-group-list";
import MultiSelect from "./multi-select";

export default function GroupListFilters() {
  const { habitat, speciesGroups, filter } = useGroupListFilter();

  return (
    <Stack gap={4} my={6}>
      <MultiSelect
        options={speciesGroups}
        name="speciesGroupIds"
        initialValue={filter?.speciesGroupIds}
        type="species"
      />
      <MultiSelect
        options={habitat}
        name="habitatIds"
        initialValue={filter?.habitatIds}
        type="habitat"
      />
    </Stack>
  );
}
