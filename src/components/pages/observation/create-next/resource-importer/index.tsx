import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBoolean
} from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { OBSERVATION_IMPORT_DIALOUGE, OBSERVATION_IMPORT_RESOURCE } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";

import ResourceRearrange from "./resource-rearrange";

export default function ResourceImporter() {
  const { t } = useTranslation();
  const [resourceGroups, setResourceGroups] = useState<any[]>([]);
  const [canPredict, setCanPredict] = useBoolean(SITE_CONFIG.OBSERVATION.PREDICT.ACTIVE);

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
    emit(OBSERVATION_IMPORT_RESOURCE, { resources: payload.filter((g) => g.length), canPredict });
  };

  const handleOnContinue = () => {
    finalizeResources(resourceGroups);
    handleOnClose();
  };

  return resourceGroups.length ? (
    <Modal isOpen={true} onClose={handleOnClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>📷 {t("observation:importer.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="info" mb={6} borderRadius="md">
            <AlertIcon />
            {t("observation:importer.group_info")}
          </Alert>
          <ResourceRearrange
            resourceGroups={resourceGroups}
            setResourceGroups={setResourceGroups}
          />

          {SITE_CONFIG.OBSERVATION.PREDICT.ACTIVE && (
            <Checkbox isChecked={canPredict} onChange={setCanPredict.toggle} mt={3}>
              {t("observation:importer.prediction_info")}
            </Checkbox>
          )}
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
