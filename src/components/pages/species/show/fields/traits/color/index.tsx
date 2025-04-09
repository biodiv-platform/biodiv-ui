import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";

import { TraitHeader } from "../common/trait-header";
import { TraitColorEdit } from "./color-edit";
import { TraitColorShow } from "./color-show";

export default function ColorTrait({ trait, traitValues, setTraitValues, setShowCategory }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    traitValues.length > 0 && setShowCategory(true);
  }, [traitValues]);

  return (
    <div>
      <TraitHeader trait={trait} onOpen={onOpen} />
      {isOpen ? (
        <TraitColorEdit
          traitId={trait.traitId}
          initialValue={traitValues}
          onSave={setTraitValues}
          onClose={onClose}
        />
      ) : (
        <TraitColorShow traitValues={traitValues} />
      )}
    </div>
  );
}
