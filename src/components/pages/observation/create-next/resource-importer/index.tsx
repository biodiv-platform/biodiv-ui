import { Button, Flex } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { OBSERVATION_IMPORT_DIALOUGE, OBSERVATION_IMPORT_RESOURCE } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";
import { LuMoveRight } from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import ResourceRearrange from "./resource-rearrange";

export default function ResourceImporter() {
  const { t } = useTranslation();
  const [resourceGroups, setResourceGroups] = useState<any[]>([]);
  const [canPredict, setCanPredict] = useState(SITE_CONFIG.OBSERVATION.PREDICT.ACTIVE);

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
    <DialogRoot open={true} onOpenChange={handleOnClose} size="lg">
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>📷 {t("observation:importer.title")}</DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>
          <Alert status="info" mb={6} borderRadius="md">
            {t("observation:importer.group_info")}
          </Alert>
          <ResourceRearrange
            resourceGroups={resourceGroups}
            setResourceGroups={setResourceGroups}
          />

          {SITE_CONFIG.OBSERVATION.PREDICT.ACTIVE && (
            <Checkbox checked={canPredict} onChange={() => setCanPredict(!canPredict)} mt={3}>
              {t("observation:importer.prediction_info")}
            </Checkbox>
          )}
        </DialogBody>

        <DialogFooter>
          <Flex flexShrink={0}>
            <Button mr={3} onClick={handleOnClose}>
              {t("common:close")}
            </Button>
            <Button colorPalette="blue" onClick={handleOnContinue}>
              {t("observation:continue")}
              <LuMoveRight />
            </Button>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  ) : null;
}
