import useTranslation from "@hooks/use-translation";
import React from "react";
import IdentifiersTable from "./table-identifiers";
import useTopIdentifiers from "./use-top-identifiers";


const TopIdentifiers = ({ filter }) => {
  const identifier = useTopIdentifiers({ filter });

  const { t } = useTranslation();

  return (
    <IdentifiersTable
      data={identifier.identifiersData.data}
      title={t("LIST.TOP_IDENTIFIERS_LIST.HEADING")}
      loadMoreIdentifiers={identifier.identifiersData.loadMore}
      filter={filter}
    />
  );
};

export default TopIdentifiers;
