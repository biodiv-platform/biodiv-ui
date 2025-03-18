import { createIcon } from "@chakra-ui/react";
import React from "react";

const LayersIcon = createIcon({
  displayName: "Layers",
  path: (
    <g
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </g>
  ),
  viewBox: "0 0 24 24"
});

export default LayersIcon;
