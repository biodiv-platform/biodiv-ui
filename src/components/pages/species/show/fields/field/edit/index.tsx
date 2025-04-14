import { SPECIES_FIELD_UPDATE, SPECIES_FIELD_UPDATED } from "@static/events";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";

import { DialogBackdrop, DialogRoot } from "@/components/ui/dialog";

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
    <DialogRoot onOpenChange={doCleanup} trapFocus={false} size="cover" open={!!initialFormValue}>
      <DialogBackdrop />
      {initialFormValue && (
        <SpeciesFieldEditForm
          initialValue={initialFormValue}
          onSave={handleOnSaved}
          onCancel={doCleanup}
        />
      )}
    </DialogRoot>
  );
}
