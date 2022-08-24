import "react-sortable-tree/style.css";

import styled from "@emotion/styled";
import React from "react";
import SortableTree from "react-sortable-tree";

import usePages from "../sidebar/use-pages-sidebar";

const TreeContainer = styled.div`
  padding-bottom: 1rem;
  .rst__rowWrapper {
    padding: 0.25rem 0;
  }
  .rst__row > div {
    border-radius: 0;
  }
  .rst__rowContents,
  .rst__moveHandle {
    box-shadow: none;
  }
`;

export default function ReOrderTree() {
  const p = usePages();

  return (
    <TreeContainer>
      <SortableTree
        treeData={p.pages}
        onChange={p.setPages}
        isVirtualized={false}
        canDrag={p.isEditing}
        scaffoldBlockPxWidth={24}
        rowHeight={48}
      />
    </TreeContainer>
  );
}
