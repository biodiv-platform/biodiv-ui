import React from "react";

import useSpeciesList from "../../use-species-list";
import TextFilterPanel from "./search";

export default function SpeciesFieldFilter() {
  const { fieldsMeta } = useSpeciesList();

  return fieldsMeta?.map((item) => (
    <TextFilterPanel
      filterKey="description"
      childHeader={item?.childHeader}
      label={item.header}
      path={item.id}
    />
  ));
}
