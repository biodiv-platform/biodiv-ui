import FlashChange from "@avinlab/react-flash-change";
import React from "react";

const Flash = ({ value, children }) => (
  <FlashChange
    value={value}
    flashClassName="flashing"
    className="flash"
    compare={(prevProps, newProps) =>
      JSON.stringify(prevProps.value) !== JSON.stringify(newProps.value)
    }
  >
    {children}
  </FlashChange>
);

export default Flash;
