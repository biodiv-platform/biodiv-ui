import useTranslation from "next-translate/useTranslation";
import React from "react";

import LifeListTable from "./table";

const LifeList = ({ filter, uniqueSpecies }) => {
  //const uniqueSpecies = useUniqueSpecies({ filter });
  const { t } = useTranslation();

  return (
    <LifeListTable
      data={{ isLoading: false, list: Object.entries(uniqueSpecies) }}
      title={t("observation:list.life_list.heading")}
      loadMoreUniqueSpecies={() => console.log("hi")}
      filter={filter}
    />
  );
};

export default LifeList;
