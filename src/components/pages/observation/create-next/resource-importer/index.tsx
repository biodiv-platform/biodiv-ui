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
import { OBSERVATION_IMPORT_DIALOUGE, OBSERVATION_IMPORT_RESOURCE } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";

import ResourceRearrange from "./resource-rearrange";

export default function ResourceImporter() {
  const { t } = useTranslation();
  const [resourceGroups, setResourceGroups] = useState<any[]>([]);

  useListener(
    (o) => {
      const _resourceGroups = o.map((group) =>
        group.map((resource) => ({
          ...resource,
          blobURL: resource.blob ? URL.createObjectURL(resource.blob) : null
        }))
      );

      // don't show dialouge when there's only one image
      if (_resourceGroups.length === 1 && o[0].length === 1) {
        finalizeResources(_resourceGroups);
      } else {
        setResourceGroups(_resourceGroups);
      }
    },
    [OBSERVATION_IMPORT_DIALOUGE]
  );

  const handleOnClose = () => {
    setResourceGroups([]);
  };

  const finalizeResources = (payload) => {
    emit(
      OBSERVATION_IMPORT_RESOURCE,
      payload.filter((g) => g.length)
    );
  };

  const handleOnContinue = () => {
    finalizeResources(resourceGroups);
    handleOnClose();
  };

  return resourceGroups.length ? (
    <Modal isOpen={true} onClose={handleOnClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("observation:importer.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ResourceRearrange
            resourceGroups={resourceGroups}
            setResourceGroups={setResourceGroups}
          />
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
