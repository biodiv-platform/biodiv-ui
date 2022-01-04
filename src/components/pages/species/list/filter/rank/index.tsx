import { covertToSentenceCase } from "@utils/text";
import React from "react";

import useSpeciesList from "../../use-species-list";
import CheckboxFilterPanel from "../shared/checkbox";

export default function RankFilter() {
  const {
    speciesData: { ag }
  } = useSpeciesList();

  const OPTIONS = Object.keys(ag?.groupRank || [])?.map((val) => ({
    label: covertToSentenceCase(val),
    value: val,
    stat: ag?.groupRank[val]
  }));

  return (
    <CheckboxFilterPanel
      translateKey="filters:rank."
      filterKey="rank"
      options={OPTIONS}
      statKey="groupRank"
      skipOptionsTranslation={true}
    />
  );
}
