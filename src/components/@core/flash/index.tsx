import FlashChange from "@avinlab/react-flash-change";
import React from "react";

const Flash = ({ value, children }) => (
  <FlashChange
    value={value}
    flashStyle={{ background: "var(--yellow-100)" }}
    style={{ transition: "background 500ms ease" }}
  >
    {children}
  </FlashChange>
);

export default Flash;
