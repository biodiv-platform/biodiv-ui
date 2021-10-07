import User from "@components/pages/observation/show/sidebar/user";
import { ShowDocument } from "@interfaces/document";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import CoveragePanel from "./coverage";
import DownloadButtons from "./download-buttons";
import DocumentSidebarMap from "./map";
import ScientificNames from "./scientific-names";
import SpatialCoverage from "./special-coverage";

interface SidebarProps {
  showDocument: ShowDocument;
  speciesGroups;
  habitatList;
  documentPath?;
}

export default function Sidebar({
  showDocument,
  speciesGroups,
  habitatList,
  documentPath
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div>
      <User user={showDocument.userIbp} />
      <DownloadButtons
        documentPath={documentPath}
        title={showDocument?.document?.title}
        documentId={showDocument?.document?.id}
      />
      <DocumentSidebarMap documentCoverages={showDocument.documentCoverages} />
      <SpatialCoverage documentCoverage={showDocument.documentCoverages} />
      <CoveragePanel
        icon="🏜"
        title={t("common:habitats_covered")}
        initialValue={showDocument.habitatIds}
        items={habitatList}
        type="habitat"
        endpointType="habitat"
        documentId={showDocument.document?.id}
      />
      <CoveragePanel
        icon="🐾"
        title={t("common:species_coverage")}
        initialValue={showDocument.speciesGroupIds}
        items={speciesGroups}
        type="species"
        endpointType="speciesGroup"
        documentId={showDocument.document?.id}
      />
      <ScientificNames
        documentId={showDocument.document?.id}
        authorId={showDocument.document?.authorId}
      />
    </div>
  );
}
