import { stripSpecialCharacters } from "@utils/text";
import React from "react";

import useSpeciesList from "../../use-species-list";
import CheckboxFilterPanel from "../shared/checkbox";

export default function MediaFilter() {
  const {
    speciesData: { ag }
  } = useSpeciesList();

  const OPTIONS = Object.keys(ag?.groupMediaType || [])?.map((val) => ({
    label: stripSpecialCharacters(val),
    value: val,
    stat: ag?.groupMediaType[val]
  }));

  return (
    <CheckboxFilterPanel
      translateKey="filters:media.title"
      filterKey="mediaFilter"
      options={OPTIONS}
      statKey="groupMediaType"
      skipOptionsTranslation={true}
      showSearch={true}
    />
  );
}
