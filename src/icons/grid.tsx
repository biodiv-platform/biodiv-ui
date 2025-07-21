import { createIcon } from "@chakra-ui/react";
import React from "react";

const GridIcon = createIcon({
  displayName: "Grid",
  path: (
    <g
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </g>
  ),
  viewBox: "0 0 24 24"
});

export default GridIcon;
