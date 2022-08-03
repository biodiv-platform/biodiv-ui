import { createIcon } from "@chakra-ui/icon";
import React from "react";

const StatsIcon = createIcon({
  displayName: "Stats",
  path: (
    <g
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </g>
  ),
  viewBox: "0 0 24 24"
});

export default StatsIcon;
