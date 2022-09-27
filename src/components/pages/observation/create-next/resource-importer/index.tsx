import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
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
import AddIcon from "@icons/add";
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
        group.map((resource) => ({ ...resource, blobURL: URL.createObjectURL(resource.blob) }))
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

  const addNewGroup = () => {
    resourceGroups.value = [...resourceGroups.value, []];
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

        <ModalFooter pt={0}>
          <Box flexGrow={1}>
            <Button colorScheme="green" leftIcon={<AddIcon />} onClick={addNewGroup}>
              {t("common:add")}
            </Button>
          </Box>
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
