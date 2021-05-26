import { TRAIT_DATA_TYPES } from "@static/trait";
import React, { useState } from "react";

import useSpeciesFields from "../use-species-field";
import ColorTrait from "./color";
import DateTrait from "./date";
import NumericTrait from "./numeric";
import SimpleTrait from "./simple";

interface SpeciesTraitViewProps {
  trait;
  setShowCategory;
}

export default function SpeciesTraitView({ trait, setShowCategory }: SpeciesTraitViewProps) {
  const { showHiddenFields } = useSpeciesFields();
  const [traitValues, setTraitValues] = useState<any[]>(trait.values);

  /*
   * To hide parent category render if they don't have value
   * and not in edit mode
   */
  if (traitValues.length === 0 && !showHiddenFields) {
    return null;
  }

  switch (trait?.dataType) {
    case TRAIT_DATA_TYPES.STRING: {
      return (
        <SimpleTrait
          trait={trait}
          traitValues={traitValues}
          setTraitValues={setTraitValues}
          setShowCategory={setShowCategory}
        />
      );
    }

    case TRAIT_DATA_TYPES.COLOR: {
      return (
        <ColorTrait
          trait={trait}
          traitValues={traitValues}
          setTraitValues={setTraitValues}
          setShowCategory={setShowCategory}
        />
      );
    }

    case TRAIT_DATA_TYPES.NUMERIC: {
      return (
        <NumericTrait
          trait={trait}
          traitValues={traitValues}
          setTraitValues={setTraitValues}
          setShowCategory={setShowCategory}
        />
      );
    }

    case TRAIT_DATA_TYPES.DATE: {
      return (
        <DateTrait
          trait={trait}
          traitValues={traitValues}
          setTraitValues={setTraitValues}
          setShowCategory={setShowCategory}
        />
      );
    }

    default:
      console.debug(`Unknown data type ${trait?.dataType}`);
      return null;
  }
}
