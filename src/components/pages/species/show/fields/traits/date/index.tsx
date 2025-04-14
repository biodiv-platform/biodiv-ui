import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";

import { TraitHeader } from "../common/trait-header";
import { TraitDateEdit } from "./date-edit";
import { TraitDateShow } from "./date-show";

const TRAIT_DATE_FORMAT = {
  MONTH: "MMMM",
  YEAR: "YYYY"
};

export default function DateTrait({ trait, traitValues, setTraitValues, setShowCategory }) {
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    traitValues.length > 0 && setShowCategory(true);
  }, [traitValues]);

  return (
    <div>
      <TraitHeader trait={trait} onOpen={onOpen} />
      {open ? (
        <TraitDateEdit
          traitId={trait.id}
          initialValue={traitValues}
          onSave={setTraitValues}
          onClose={onClose}
        />
      ) : (
        <TraitDateShow format={TRAIT_DATE_FORMAT[trait.units]} values={traitValues} />
      )}
    </div>
  );
}
