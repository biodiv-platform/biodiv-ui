import React from "react";

import usePagesSidebar from "../use-pages-sidebar";
import { LinkParent } from "./link";

export default function SidebarNormal() {
  const { pages, currentPage, linkType } = usePagesSidebar();

  return (
    <div>
      {pages.map((parentPage) => (
        <LinkParent
          page={parentPage}
          currentPageId={Number(currentPage?.id || -1)}
          key={parentPage.id}
          linkType={linkType}
        />
      ))}
    </div>
  );
}
