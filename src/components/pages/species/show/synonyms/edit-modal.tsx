import { Modal, ModalOverlay } from "@chakra-ui/modal";
import useTranslation from "@hooks/use-translation";
import { axDeleteSpeciesSynonym } from "@services/species.service";
import { SPECIES_SYNONYM_ADD, SPECIES_SYNONYM_DELETE, SPECIES_SYNONYM_EDIT } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { useListener } from "react-gbus";

import useSpecies from "../use-species";
import SpeciesSynonymForm from "./form";

export default function SynonymEditModal({ onUpdate }) {
  const [initialEdit, setInitialEdit] = useState<any>();
  const { t } = useTranslation();
  const { species } = useSpecies();

  const handleOnSynonymDelete = async (synonym) => {
    if (confirm(t("SPECIES.SYNONYM.DELETE.DIALOUGE"))) {
      const { success, data } = await axDeleteSpeciesSynonym(species.species.id, synonym.id);

      if (success) {
        onUpdate(data);
        notification(t("SPECIES.SYNONYM.DELETE.SUCCESS"), NotificationType.Success);
      } else {
        notification(t("SPECIES.SYNONYM.DELETE.FAILURE"));
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
        <SpeciesSynonymForm synonym={initialEdit} onUpdate={onUpdate} onClose={onClose} />
      )}
    </Modal>
  );
}
