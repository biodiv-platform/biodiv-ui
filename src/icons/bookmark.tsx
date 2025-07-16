import { createIcon } from "@chakra-ui/react";
import React from "react";

const BookmarkIcon = createIcon({
  displayName: "Bookmark",
  path: (
    <g
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </g>
  ),
  viewBox: "0 0 24 24"
});

export default BookmarkIcon;
