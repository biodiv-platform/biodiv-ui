import useTranslation from "@hooks/use-translation";
import React from "react";

import LifeListTable from "./table";
import useUniqueSpecies from "./use-unique-species";

const LifeList = ({ filter }) => {
  const uniqueSpecies = useUniqueSpecies({ filter });
  const { t } = useTranslation();

  return (
    <LifeListTable
      data={uniqueSpecies.speciesData.data}
      title={t("LIST.LIFE_LIST.HEADING")}
      loadMoreUniqueSpecies={uniqueSpecies.speciesData.loadMore}
      filter={filter}
    />
  );
};

export default LifeList;
