import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useTaxonFilter from "../../use-taxon";
import { TaxonModalTabs } from "./tabs";

export default function TaxonShowModal() {
  const { t } = useTranslation();
  const { showTaxon, setShowTaxon } = useTaxonFilter();

  const handleOnClose = () => setShowTaxon(undefined);

  return (
    <>
      <Modal isOpen={showTaxon} onClose={handleOnClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("taxon:modal.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaxonModalTabs />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleOnClose}>
              {t("common:close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
