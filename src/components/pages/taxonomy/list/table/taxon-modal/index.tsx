import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { TAXON } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useListener } from "react-gbus";

import useTaxonFilter from "../../use-taxon";
import { TaxonModalTabs } from "./tabs";

export default function TaxonShowModal() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setModalTaxon } = useTaxonFilter();

  useListener(onOpen, [TAXON.SELECTED]);

  const handleOnClose = () => {
    onClose();
    setModalTaxon(undefined);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("taxon:modal.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaxonModalTabs />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              {t("common:close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
