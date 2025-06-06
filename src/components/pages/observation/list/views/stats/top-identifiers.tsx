import useTranslation from "next-translate/useTranslation";
import React from "react";

import IdentifiersTable from "./table-identifiers";
import useTopIdentifiers from "./use-top-identifiers";

const TopIdentifiers = ({ filter, topIdentifiers }) => {
  const identifier = useTopIdentifiers({ filter });

  const { t } = useTranslation();

  return (
    <IdentifiersTable
      data={{ isLoading: false || identifier.identifiersData.data.isLoading, list: [...topIdentifiers, ...identifier.identifiersData.data.list] }}
      title={t("observation:list.top_identifiers_list.heading")}
      loadMoreIdentifiers={identifier.identifiersData.loadMore}
      filter={filter}
    />
  );
};

export default TopIdentifiers;
