import User from "@components/pages/observation/show/sidebar/user";
import { ShowDocument } from "@interfaces/document";
import React from "react";

import DownloadButtons from "./download-buttons";
import HabitatsCoverage from "./habitats-coverage";
import DocumentSidebarMap from "./map";
import SpatialCoverage from "./special-coverage";
import SpeciesCoverage from "./species-coverage";

interface SidebarProps {
  d: ShowDocument;
}

export default function Sidebar({ d }: SidebarProps) {
  return (
    <div>
      <User user={d.userIbp} />
      <DownloadButtons
        documentPath={d?.uFile?.path}
        title={d.document.title}
        documentId={d?.document?.id}
      />
      <DocumentSidebarMap documentCoverages={d.documentCoverages} />
      <SpatialCoverage documentCoverage={d.documentCoverages} />
      <HabitatsCoverage habitat={d.habitatIds} />
      <SpeciesCoverage speciesGroup={d.speciesGroupIds} />
    </div>
  );
}
