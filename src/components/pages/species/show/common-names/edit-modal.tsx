import { Modal, ModalOverlay } from "@chakra-ui/modal";
import useTranslation from "@hooks/use-translation";
import { axDeleteSpeciesCommonName } from "@services/species.service";
import { SPECIES_NAME_ADD, SPECIES_NAME_DELETE, SPECIES_NAME_EDIT } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { useListener } from "react-gbus";
import useSpecies from "../use-species";

import { SpeciesCommonNameForm } from "./form";

export function CommonNameEditModal({ onUpdate }) {
  const [initialEdit, setInitialEdit] = useState<any>();
  const { t } = useTranslation();
  const { species } = useSpecies();

  const handleOnCommonNameDelete = async (commonName) => {
    if (confirm(t("SPECIES.COMMON_NAME.DELETE.DIALOUGE"))) {
      const { success, data } = await axDeleteSpeciesCommonName(species.species.id, commonName.id);
      if (success) {
        onUpdate(data);
        notification(t("SPECIES.COMMON_NAME.DELETE.SUCCESS"), NotificationType.Success);
      } else {
        notification(t("SPECIES.COMMON_NAME.DELETE.FAILURE"));
      }
    }
  };

  useListener(handleOnCommonNameDelete, [SPECIES_NAME_DELETE]);

  useListener(setInitialEdit, [SPECIES_NAME_EDIT, SPECIES_NAME_ADD]);

  const onClose = () => setInitialEdit(undefined);

  return (
    <Modal onClose={onClose} size="md" isOpen={!!initialEdit}>
      <ModalOverlay />
      {initialEdit && (
        <SpeciesCommonNameForm commonName={initialEdit} onUpdate={onUpdate} onClose={onClose} />
      )}
    </Modal>
  );
}
