import { createIcon } from "@chakra-ui/react";
import React from "react";

const CalendarIcon = createIcon({
  displayName: "Calendar",
  path: (
    <g
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </g>
  ),
  viewBox: "0 0 24 24"
});

export default CalendarIcon;
