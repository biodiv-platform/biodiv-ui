import CreateGroupFrom from "./form/speciesCheckBox";
import React from "react";

function createGroupPage({ speciesGroups, habitats }) {
  return (
    <div className="container mt">
      <CreateGroupFrom habitats={habitats} speciesGroups={speciesGroups} />
    </div>
  );
}

export default createGroupPage;
