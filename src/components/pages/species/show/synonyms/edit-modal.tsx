import { Modal, ModalOverlay } from "@chakra-ui/modal";
import { SPECIES_SYNONYM_ADD, SPECIES_SYNONYM_DELETE, SPECIES_SYNONYM_EDIT } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useListener } from "react-gbus";

import SynonymForm from "./form";

export default function SynonymEditModal({ onUpdate, speciesId, taxonId, updateFunc, deleteFunc }) {
  const [initialEdit, setInitialEdit] = useState<any>();
  const { t } = useTranslation();

  const handleOnSynonymDelete = async (synonym) => {
    if (confirm(t("species:synonym.delete.dialouge"))) {
      const { success, data } = await deleteFunc(speciesId, taxonId, synonym.id);

      if (success) {
        onUpdate(data);
        notification(t("species:synonym.delete.success"), NotificationType.Success);
      } else {
        notification(t("species:synonym.delete.failure"));
      }
    }
  };

  useListener(handleOnSynonymDelete, [SPECIES_SYNONYM_DELETE]);

  useListener(setInitialEdit, [SPECIES_SYNONYM_EDIT, SPECIES_SYNONYM_ADD]);

  const onClose = () => setInitialEdit(undefined);

  return (
    <Modal onClose={onClose} size="md" isOpen={!!initialEdit}>
      <ModalOverlay />
      {initialEdit && (
        <SynonymForm
          synonym={initialEdit}
          onUpdate={onUpdate}
          speciesId={speciesId}
          taxonId={taxonId}
          updateFunc={updateFunc}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
