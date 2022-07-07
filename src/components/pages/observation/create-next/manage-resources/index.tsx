import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import ManageResourcesForm from "./form";

export default function ManageResourcesModal(props) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("observation:mange_resources")}</ModalHeader>
        <ModalCloseButton />
        <ManageResourcesForm {...props} />
      </ModalContent>
    </Modal>
  );
}
