import React, { useMemo } from "react";

import useSpeciesList from "../../use-species-list";
import TextFilterPanel from "./search";
const excludedSpeciesField = ["Meta data", "Information Listing", "Occurrence"];

export default function SpeciesFieldFilter() {
  const { fieldsMeta } = useSpeciesList();

  const fieldMetaFiltered = useMemo(
    () => fieldsMeta.filter((item) => !excludedSpeciesField.includes(item.header)),
    fieldsMeta
  );

  return fieldMetaFiltered?.map(({ id, childHeader, header }) => (
    <TextFilterPanel filterKey="description" childHeader={childHeader} label={header} path={id} />
  ));
}
