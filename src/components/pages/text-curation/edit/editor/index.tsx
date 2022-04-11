import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useCurateEdit from "../use-curate-edit";
import EditFields from "./edit-fields";

export default function CurationEditModal() {
  const { t } = useTranslation();
  const { rows } = useCurateEdit();

  if (!rows.editing) return null;

  const handleOnClose = () => rows.setEditing(undefined);

  return (
    <Modal isOpen={rows.editing} onClose={handleOnClose} blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t("common:edit")} {rows.editing.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{rows.editing && <EditFields />}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
