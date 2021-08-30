import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import ListTiles from "./list-tiles";
import { SpeciesListProvider } from "./use-species-list";

export default function SpeciesListPageComponent() {
  const { t } = useTranslation();

  return (
    <SpeciesListProvider>
      <div className="container mt">
        <PageHeading>🐾 {t("species:list.title")}</PageHeading>
        <ListTiles />
      </div>
    </SpeciesListProvider>
  );
}
