import { createIcon } from "@chakra-ui/react";
import React from "react";

const MessageIcon = createIcon({
  displayName: "Message",
  path: (
    <g
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </g>
  ),
  viewBox: "0 0 24 24"
});

export default MessageIcon;
