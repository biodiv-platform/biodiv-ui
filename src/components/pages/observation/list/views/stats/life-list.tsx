import useTranslation from "next-translate/useTranslation";
import React from "react";

import LifeListTable from "./table";
import useUniqueSpecies from "./use-unique-species";

const LifeList = ({ filter }) => {
  const uniqueSpecies = useUniqueSpecies({ filter });
  const { t } = useTranslation();

  return (
    <LifeListTable
      data={uniqueSpecies.speciesData.data}
      title={t("observation:list.life_list.heading")}
      loadMoreUniqueSpecies={uniqueSpecies.speciesData.loadMore}
      filter={filter}
    />
  );
};

export default LifeList;
