import "react-image-crop/dist/ReactCrop.css";

import { Box, Button, ButtonGroup, Divider, Image } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import { axUpdateCropResources } from "@services/observation.service";
import { CROP_STATUS, RESOURCE_SIZE } from "@static/constants";
import { getFallbackByMIME, getResourceRAW, getResourceThumbnail } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import produce from "immer";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import ReactCrop from "react-image-crop";

import ObservationImageStatusBadge from "../status-badge";

const objectToArray = (obj) => {
  return obj ? [obj.x, obj.y, obj.width, obj.height] : null;
};

const arrayToObject = (arr) => {
  return arr ? { x: arr[0], y: arr[1], width: arr[2], height: arr[3], unit: "px" } : null;
};

export default function CropTab({ data, setData }) {
  const [crop, setCrop] = useState<any | null>(arrayToObject(data?.observationResource?.[0]?.bbox));
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

  if (data?.id) {
    return (
      <>
        <Grid h="450px" templateRows="repeat(9, 1fr)" templateColumns="repeat(5, 1fr)" gap={2}>
          <GridItem rowSpan={9} colSpan={1} overflow="auto" display="flex">
            {data?.observationResource?.map(({ selectionStatus, resource, bbox }) => (
              <Box width="10rem" h="6.5rem" position="relative">
                <Box position="absolute" top={0} left={0} ml={2}>
                  <ObservationImageStatusBadge
                    status={selectionStatus || CROP_STATUS.NOT_CURATED}
                  />
                </Box>
                <Image
                  w="full"
                  h="full"
                  borderRadius="md"
                  border="2px solid"
                  borderColor={currentCropItem?.id === resource.id ? "blue.500" : "gray.200"}
                  objectFit="cover"
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
            <Divider orientation="vertical" ml={5} />
          </GridItem>
          <GridItem
            rowSpan={8}
            colSpan={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor="#cccccc"
            borderRadius="1rem"
            height="fit-content"
            ml={1}
          >
            <>
              <ReactCrop
                crop={crop}
                aspect={4 / 3}
                onChange={(c) => {
                  setCrop(c);
                }}
              >
                <Image
                  alt={`${currentCropItem?.id}`}
                  src={getResourceRAW(currentCropItem.context, currentCropItem.fileName)}
                  width="auto"
                  height="23rem"
                  maxWidth="100%"
                />
              </ReactCrop>
            </>
          </GridItem>
          <GridItem rowSpan={1} colSpan={4} display="flex" justifyContent="space-between" mb={4}>
            <ButtonGroup gap={1}>
              <Button colorScheme="green" onClick={() => handleValidate(currentCropItem.id)}>
                {t("observation:crop.actions.curate")}
              </Button>
              <Button colorScheme="red" onClick={() => handleReject(currentCropItem.id)}>
                {t("observation:crop.actions.reject")}
              </Button>
            </ButtonGroup>
            <Button colorScheme="blue" onClick={() => handleReset(currentCropItem.id)}>
              {t("observation:crop.actions.un_curate")}
            </Button>
          </GridItem>
        </Grid>
      </>
    );
  } else {
    return <>{CROP_STATUS.OBSERVATION_NULL_MESSAGE}</>;
  }
}
