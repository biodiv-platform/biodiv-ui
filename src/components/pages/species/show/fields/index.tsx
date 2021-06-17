import React from "react";

import useSpecies from "../use-species";
import SpeciesFieldSimpleEdit from "./field/edit";
import FieldGroupPanel from "./field-group-panel";
import { SpeciesFieldsProvider } from "./use-species-field";

export default function SpeciesFields() {
  const { species } = useSpecies();

  return (
    <div>
      <SpeciesFieldSimpleEdit />
      {species.fieldData.map((fieldGroup) => (
        <SpeciesFieldsProvider key={fieldGroup.parentField.id}>
          <FieldGroupPanel key={fieldGroup.parentField.id} {...fieldGroup} />
        </SpeciesFieldsProvider>
      ))}
    </div>
  );
}
