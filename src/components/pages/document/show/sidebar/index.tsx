import User from "@components/pages/observation/show/sidebar/user";
import { ShowDocument } from "@interfaces/document";
import React from "react";

import DownloadButtons from "./download-buttons";
import DocumentSidebarMap from "./map";

interface SidebarProps {
  d: ShowDocument;
}

export default function Sidebar({ d }: SidebarProps) {
  return (
    <div>
      <User user={d.userIbp} />
      <DownloadButtons />
      <DocumentSidebarMap documentCoverages={d.documentCoverages} />
    </div>
  );
}
