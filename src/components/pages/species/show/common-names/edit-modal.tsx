import { axPreferredSpeciesCommonName } from "@services/species.service";
import {
  SPECIES_NAME_ADD,
  SPECIES_NAME_DELETE,
  SPECIES_NAME_EDIT,
  SPECIES_NAME_PREFERRED,
  SPECIES_NAME_PREFERRED_UPDATED
} from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";

import { DialogBackdrop, DialogRoot } from "@/components/ui/dialog";

import { SpeciesCommonNameForm } from "./form";

export function CommonNameEditModal({ onUpdate, speciesId, updateFunc, deleteFunc, taxonId }) {
  const [initialEdit, setInitialEdit] = useState<any>();
  const { t } = useTranslation();

  const handleOnCommonNameDelete = async (commonName) => {
    if (confirm(t("species:common_name.delete.dialouge"))) {
      const { success, data } = await deleteFunc(speciesId, commonName.id);
      if (success) {
        onUpdate(data);
        notification(t("species:common_name.delete.success"), NotificationType.Success);
      } else {
        notification(t("species:common_name.delete.failure"));
      }
    }
  };

  useListener(handleOnCommonNameDelete, [SPECIES_NAME_DELETE]);

  const handleOnCommonNamePreferred = async (commonName) => {
    const { success, data } = await axPreferredSpeciesCommonName(speciesId, commonName.id);
    if (success) {
      emit(SPECIES_NAME_PREFERRED_UPDATED, data);
      notification(t("species:common_name.preferred.success"), NotificationType.Success);
    } else {
      notification(t("species:common_name.preferred.failure"));
    }
  };

  useListener(handleOnCommonNamePreferred, [SPECIES_NAME_PREFERRED]);

  useListener(setInitialEdit, [SPECIES_NAME_EDIT, SPECIES_NAME_ADD]);

  const onClose = () => setInitialEdit(undefined);

  return (
    <DialogRoot onOpenChange={onClose} size="md" open={!!initialEdit}>
      <DialogBackdrop />
      {initialEdit && (
        <SpeciesCommonNameForm
          commonName={initialEdit}
          onUpdate={onUpdate}
          updateFunc={updateFunc}
          speciesId={speciesId}
          taxonId={taxonId}
          onClose={onClose}
        />
      )}
    </DialogRoot>
  );
}
