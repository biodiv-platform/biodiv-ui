import User from "@components/pages/observation/show/sidebar/user";
import useTranslation from "@hooks/use-translation";
import { ShowDocument } from "@interfaces/document";
import React from "react";

import CoveragePanel from "./coverage";
import DownloadButtons from "./download-buttons";
import DocumentSidebarMap from "./map";
import SpatialCoverage from "./special-coverage";

interface SidebarProps {
  d: ShowDocument;
  speciesGroups;
  habitatList;
}

export default function Sidebar({ d, speciesGroups, habitatList }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div>
      <User user={d.userIbp} />
      <DownloadButtons
        documentPath={d?.uFile?.path}
        title={d?.document?.title}
        documentId={d?.document?.id}
      />
      <DocumentSidebarMap documentCoverages={d.documentCoverages} />
      <SpatialCoverage documentCoverage={d.documentCoverages} />
      <CoveragePanel
        icon="🏜"
        title={t("GROUP.HABITATS_COVERED")}
        initialValue={d.habitatIds}
        items={habitatList}
        type="habitat"
        endpointType="habitat"
        documentId={d.document?.id}
      />
      <CoveragePanel
        icon="🐾"
        title={t("GROUP.SPECIES_COVERAGE")}
        initialValue={d.speciesGroupIds}
        items={speciesGroups}
        type="species"
        endpointType="speciesGroup"
        documentId={d.document?.id}
      />
    </div>
  );
}
