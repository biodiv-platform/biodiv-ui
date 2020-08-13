import React from "react";

import Header from "./header";
import LandscapeList from "./landscape-list";

export default function LandscapeListComponent({ nextOffset }) {
  return (
    <div className="container mt">
      <Header />
      <LandscapeList nextOffset={nextOffset} />
    </div>
  );
}
