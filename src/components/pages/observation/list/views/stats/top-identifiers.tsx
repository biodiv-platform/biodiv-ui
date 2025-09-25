import useTranslation from "next-translate/useTranslation";
import React from "react";

import IdentifiersTable from "./table-identifiers";
import useTopIdentifiers from "./use-top-identifiers";

const TopIdentifiers = ({ filter }) => {
  const identifier = useTopIdentifiers({ filter });

  const { t } = useTranslation();

  return (
    <IdentifiersTable
      data={identifier.identifiersData.data}
      title={t("observation:list.top_identifiers_list.heading")}
      loadMoreIdentifiers={identifier.identifiersData.loadMore}
      changeSort = {identifier.identifiersData.changeSort}
      filter={filter}
    />
  );
};

export default TopIdentifiers;
