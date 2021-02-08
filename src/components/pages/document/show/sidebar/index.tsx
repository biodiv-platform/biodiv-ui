import User from "@components/pages/observation/show/sidebar/user";
import useTranslation from "@hooks/use-translation";
import { ShowDocument } from "@interfaces/document";
import React from "react";

import CoveragePanel from "./coverage";
import DownloadButtons from "./download-buttons";
import DocumentSidebarMap from "./map";
import SpatialCoverage from "./special-coverage";

interface SidebarProps {
  showDocument: ShowDocument;
  speciesGroups;
  habitatList;
}

export default function Sidebar({ showDocument, speciesGroups, habitatList }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div>
      <User user={showDocument.userIbp} />
      <DownloadButtons
        documentPath={showDocument?.uFile?.path}
        title={showDocument?.document?.title}
        documentId={showDocument?.document?.id}
      />
      <DocumentSidebarMap documentCoverages={showDocument.documentCoverages} />
      <SpatialCoverage documentCoverage={showDocument.documentCoverages} />
      <CoveragePanel
        icon="🏜"
        title={t("GROUP.HABITATS_COVERED")}
        initialValue={showDocument.habitatIds}
        items={habitatList}
        type="habitat"
        endpointType="habitat"
        documentId={showDocument.document?.id}
      />
      <CoveragePanel
        icon="🐾"
        title={t("GROUP.SPECIES_COVERAGE")}
        initialValue={showDocument.speciesGroupIds}
        items={speciesGroups}
        type="species"
        endpointType="speciesGroup"
        documentId={showDocument.document?.id}
      />
    </div>
  );
}
