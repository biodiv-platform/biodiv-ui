import useTranslation from "next-translate/useTranslation";
import React from "react";

import ScientificNamesTable from "./table-scientific-names";
import useScientificNames from "./use-scientific-names";

export default function ScientificNames({ documentId, authorId }) {
  const scientficNamesData = useScientificNames(documentId);
  const { t } = useTranslation();

  return (
    <ScientificNamesTable
      data={scientficNamesData.namesData.data}
      title={t("document:show.scientific_names_table.title")}
      loadMoreNames={scientficNamesData.namesData.loadMore}
      authorId={authorId}
      refreshFunc={scientficNamesData.namesData.refresh}
    />
  );
}
