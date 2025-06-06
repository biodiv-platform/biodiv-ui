import useTranslation from "next-translate/useTranslation";
import React from "react";

import LifeListTable from "./table";
import useUniqueSpecies from "./use-unique-species";

const LifeList = ({ filter, uniqueSpecies }) => {
  const uniqueSpec = useUniqueSpecies({ filter });
  const { t } = useTranslation();

  return (
    <LifeListTable
      data={{ isLoading: false || uniqueSpec.speciesData.data.isLoading, list: [...Object.entries(uniqueSpecies || {}),...uniqueSpec.speciesData.data.list] }}
      title={t("observation:list.life_list.heading")}
      loadMoreUniqueSpecies={uniqueSpec.speciesData.loadMore}
      filter={filter}
    />
  );
};

export default LifeList;
