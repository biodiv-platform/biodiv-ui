import { createIcon } from "@chakra-ui/icon";
import React from "react";

const SmartphoneIcon = createIcon({
  displayName: "Smartphone",
  path: (
    <g
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </g>
  ),
  viewBox: "0 0 24 24"
});

export default SmartphoneIcon;
