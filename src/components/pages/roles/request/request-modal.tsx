import { Modal, ModalOverlay } from "@chakra-ui/modal";
import React from "react";

import { TaxonPermissionRequestForm } from "./form";

export function TaxonPermissionRequestModal({ taxon, isOpen, onClose, isAdmin }) {
  return (
    <Modal onClose={onClose} size="md" isOpen={isOpen}>
      <ModalOverlay />
      {isOpen && <TaxonPermissionRequestForm taxon={taxon} isAdmin={isAdmin} onClose={onClose} />}
    </Modal>
  );
}
