import "react-image-crop/dist/ReactCrop.css";

import { Box, Button, ButtonGroup, Flex, GridItem, Image, SimpleGrid } from "@chakra-ui/react";
import { axUpdateCropResources } from "@services/observation.service";
import { CROP_STATUS, RESOURCE_SIZE } from "@static/constants";
import { getFallbackByMIME, getResourceRAW, getResourceThumbnail } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import produce from "immer";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import ReactCrop from "react-image-crop";

import { ImageWithFallback } from "@/components/@core/image-with-fallback";

import ObservationImageStatusBadge from "../status-badge";

const objectToArray = (obj) => {
  return obj ? [obj.x, obj.y, obj.width, obj.height] : null;
};

const arrayToObject = (arr) => {
  return arr ? { x: arr[0], y: arr[1], width: arr[2], height: arr[3], unit: "px" } : null;
};

export default function CropTab({ data, setData, canCrop }) {
  if (!data.id) return <>{CROP_STATUS.OBSERVATION_NULL_MESSAGE}</>;

  const [crop, setCrop] = useState<any>(arrayToObject(data?.observationResource?.[0]?.bbox));
  const [currentCropItem, setCurrentCropItem] = useState(data?.observationResource?.[0]?.resource);
  const { t } = useTranslation();

  async function updateCropResources(update) {
    const response = await axUpdateCropResources(update);
    if (response.success) {
      notification("Updated Successfully", NotificationType.Success);
    } else {
      notification("Update Failed");
    }
  }

  const handleCrop = (resource, cropCoordinates) => {
    setCurrentCropItem(resource);
    setCrop(arrayToObject(cropCoordinates));
  };

  const handleValidate = (id) => {
    const newData = produce(data, (draft: any) => {
      const update = draft.observationResource.find((item) => item.resource.id === id);
      update.selectionStatus = CROP_STATUS.SELECTED;
      update.bbox = objectToArray(crop);
    });

    setData(newData);
    updateCropResources(newData);
  };

  const handleReject = (id) => {
    const newData = produce(data, (draft: any) => {
      const update = draft.observationResource.find((item) => item.resource.id === id);
      update.selectionStatus = CROP_STATUS.REJECTED;
      update.bbox = null;
    });

    setData(newData);
    updateCropResources(newData);
    setCrop(null);
  };

  const handleReset = (id) => {
    const newData = produce(data, (draft: any) => {
      const update = draft.observationResource.find((item) => item.resource.id === id);
      update.selectionStatus = CROP_STATUS.NOT_CURATED;
      update.bbox = null;
    });

    setData(newData);
    updateCropResources(newData);
    setCrop(null);
  };

  return (
    <SimpleGrid columns={10} gap={4} mb={3}>
      <GridItem colSpan={{ base: 10, md: 2 }} h="full">
        <Flex
          gap={4}
          direction={{ base: "row", md: "column" }}
          w="full"
          overflow="auto"
          maxH="23rem"
        >
          {data?.observationResource?.map(({ selectionStatus, resource, bbox }) => (
            <Box minW="8rem" width="full" h="7rem" position="relative">
              <Box position="absolute" top={0} left={0} ml={3} mt={1} hidden={!canCrop}>
                <ObservationImageStatusBadge status={selectionStatus || CROP_STATUS.NOT_CURATED} />
              </Box>
              <ImageWithFallback
                w="full"
                h="full"
                borderRadius="md"
                border="3px solid"
                borderColor={currentCropItem?.id === resource.id ? "blue.500" : "gray.300"}
                bg="gray.200"
                objectFit="contain"
                fallbackSrc={getFallbackByMIME(resource.type)}
                alt={`${resource.id}`}
                src={getResourceThumbnail(
                  resource.context,
                  resource.fileName,
                  RESOURCE_SIZE.DEFAULT
                )}
                onClick={() => handleCrop(resource, bbox)}
              />
            </Box>
          ))}
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 10, md: 8 }}>
        <Flex
          alignItems="center"
          justifyContent="center"
          h="fit-content"
          bg="gray.200"
          borderRadius="md"
          mb={4}
        >
          <ReactCrop crop={crop} disabled={!canCrop} onChange={(c) => setCrop(c)}>
            <Image
              alt={`${currentCropItem?.id}`}
              src={getResourceRAW(currentCropItem.context, currentCropItem.fileName)}
              width="auto"
              height="23rem"
              maxWidth="100%"
            />
          </ReactCrop>
        </Flex>

        <Flex hidden={!canCrop} justifyContent="space-between">
          <ButtonGroup gap={2}>
            <Button colorPalette="green" onClick={() => handleValidate(currentCropItem.id)}>
              {t("observation:crop.actions.curate")}
            </Button>
            <Button colorPalette="red" onClick={() => handleReject(currentCropItem.id)}>
              {t("observation:crop.actions.reject")}
            </Button>
          </ButtonGroup>
          <Button colorPalette="blue" onClick={() => handleReset(currentCropItem.id)}>
            {t("observation:crop.actions.un_curate")}
          </Button>
        </Flex>
      </GridItem>
    </SimpleGrid>
  );
}
