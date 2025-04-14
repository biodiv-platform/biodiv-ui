import { Box, useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";

import { TraitHeader } from "../common/trait-header";
import SimpleTraitEdit from "./simple-edit";
import SimpleTraitShow from "./simple-show";

export default function SimpleTrait({ trait, traitValues, setTraitValues, setShowCategory }) {
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    traitValues.length && setShowCategory(true);
  }, [traitValues]);

  return (
    <Box lineHeight={1}>
      <TraitHeader trait={trait} onOpen={onOpen} />
      {open ? (
        <SimpleTraitEdit
          trait={trait}
          initialValue={traitValues}
          onSave={setTraitValues}
          onClose={onClose}
        />
      ) : (
        <SimpleTraitShow values={traitValues} options={trait.options} />
      )}
    </Box>
  );
}
