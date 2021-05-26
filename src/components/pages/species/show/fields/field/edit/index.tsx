import { Modal, ModalOverlay } from "@chakra-ui/react";
import { SPECIES_FIELD_UPDATE, SPECIES_FIELD_UPDATED } from "@static/events";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";

import SpeciesFieldEditForm from "./edit-form";

export default function SpeciesFieldSimpleEdit() {
  const [initialFormValue, setInitialFormValue] = useState<any>();

  const doCleanup = () => setInitialFormValue(undefined);

  const handleOnSaved = (value) => {
    emit(SPECIES_FIELD_UPDATED, value);
    doCleanup();
  };

  useListener(setInitialFormValue, [SPECIES_FIELD_UPDATE]);

  return (
    <Modal onClose={doCleanup} size="6xl" isOpen={!!initialFormValue}>
      <ModalOverlay />
      {initialFormValue && (
        <SpeciesFieldEditForm
          initialValue={initialFormValue}
          onSave={handleOnSaved}
          onCancel={doCleanup}
        />
      )}
    </Modal>
  );
}
