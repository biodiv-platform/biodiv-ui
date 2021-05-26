import { PageHeading } from "@components/@core/layout";
import useTranslation from "@hooks/use-translation";
import React from "react";

import ListTiles from "./list-tiles";
import { SpeciesListProvider } from "./use-observation-list";

export default function SpeciesListPageComponent() {
  const { t } = useTranslation();

  return (
    <SpeciesListProvider>
      <div className="container mt">
        <PageHeading>🐾 {t("SPECIES.LIST.TITLE")}</PageHeading>
        <ListTiles />
      </div>
    </SpeciesListProvider>
  );
}
