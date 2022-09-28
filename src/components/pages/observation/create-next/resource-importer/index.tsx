import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import { useSignal } from "@preact/signals-react";
import { OBSERVATION_IMPORT_DIALOUGE, OBSERVATION_IMPORT_RESOURCE } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit, useListener } from "react-gbus";

import ResourceRearrange from "./resource-rearrange";

export default function ResourceImporter() {
  const { t } = useTranslation();
  const resourceGroups = useSignal([] as any);

  useListener(
    (o) => {
      const _resourceGroups = o.map((group) =>
        group.map((resource) => ({
          ...resource,
          blobURL: resource.blob ? URL.createObjectURL(resource.blob) : null
        }))
      );

      // show group dialouge only when there are more then one groups
      if (_resourceGroups.length > 1) {
        resourceGroups.value = _resourceGroups;
      } else {
        finalizeResources(_resourceGroups);
      }
    },
    [OBSERVATION_IMPORT_DIALOUGE]
  );

  const handleOnClose = () => {
    resourceGroups.value = [];
  };

  const finalizeResources = (payload) => {
    emit(
      OBSERVATION_IMPORT_RESOURCE,
      payload.filter((g) => g.length)
    );
  };

  const handleOnContinue = () => {
    finalizeResources(resourceGroups.value);
    handleOnClose();
  };

  return resourceGroups.value.length ? (
    <Modal isOpen={true} onClose={handleOnClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("observation:importer.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ResourceRearrange resourceGroups={resourceGroups} />
        </ModalBody>

        <ModalFooter>
          <Flex flexShrink={0}>
            <Button mr={3} onClick={handleOnClose}>
              {t("common:close")}
            </Button>
            <Button colorScheme="blue" rightIcon={<ArrowForwardIcon />} onClick={handleOnContinue}>
              {t("observation:continue")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : null;
}
