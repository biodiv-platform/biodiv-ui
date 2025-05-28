import useTranslation from "next-translate/useTranslation";
import React from "react";

import IdentifiersTable from "./table-identifiers";

const TopIdentifiers = ({ filter, topIdentifiers }) => {
  //const identifier = useTopIdentifiers({ filter });

  const { t } = useTranslation();

  return (
    <IdentifiersTable
      data={{ isLoading: false, list: topIdentifiers }}
      title={t("observation:list.top_identifiers_list.heading")}
      loadMoreIdentifiers={() => console.log("hi")}
      filter={filter}
    />
  );
};

export default TopIdentifiers;
