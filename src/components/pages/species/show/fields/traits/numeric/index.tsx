import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";

import { TraitHeader } from "../common/trait-header";
import NumericTraitEdit from "./numeric-edit";
import NumericTraitShow from "./numeric-show";

export default function NumericTrait({ trait, traitValues, setTraitValues, setShowCategory }) {
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    traitValues.length > 0 && setShowCategory(true);
  }, [traitValues]);

  return (
    <div>
      <TraitHeader trait={trait} onOpen={onOpen} />
      {open ? (
        <NumericTraitEdit
          traitId={trait.traitId}
          initialValue={traitValues}
          onSave={setTraitValues}
          onClose={onClose}
        />
      ) : (
        <NumericTraitShow values={traitValues} />
      )}
    </div>
  );
}
