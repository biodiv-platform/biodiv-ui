import "react-sortable-tree/style.css";

import { useLocalRouter } from "@components/@core/local-link";
import React from "react";
import SortableTree from "react-sortable-tree";

import usePagesSidebar from "./use-pages-sidebar";

export default function SidebarEditing() {
  const p = usePagesSidebar();
  const router = useLocalRouter();

  return (
    <SortableTree
      treeData={p.pages}
      onChange={p.setPages}
      isVirtualized={false}
      canDrag={p.isEditing}
      scaffoldBlockPxWidth={24}
      generateNodeProps={({ node }) => ({
        onClick: () => {
          router.push(`/page/${p.linkType}/${node.id}`);
        },
        style: {
          background: node.id === Number(p.currentPage?.id) ? "var(--blue-100)" : "var(--gray-50)"
        }
      })}
      rowHeight={48}
    />
  );
}
