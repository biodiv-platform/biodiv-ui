import { AspectRatio, Box, GridItem, Image } from "@chakra-ui/react";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import { Draggable } from "@hello-pangea/dnd";
import useGlobalState from "@hooks/use-global-state";
import { ACCEPTED_FILE_TYPES } from "@static/observation-create";
import { getFallbackByMIME } from "@utils/media";
import React, { useMemo } from "react";

export const Resource = ({ resource, index }) => {
  const { user } = useGlobalState();

  const imgThumb = useMemo(
    () => ({
      key: resource.hashKey,
      src: getImageThumb(resource, user?.id),
      fallbackSrc: getFallbackByMIME(resource?.["type"]),
      title: resource.fileName
    }),
    [resource]
  );

  const resourceTypeFileFormat = "." + resource.type.substring(resource.type.indexOf("/") + 1);
  const isImage = ACCEPTED_FILE_TYPES["image/*"].includes(resourceTypeFileFormat);
  const isVideo = ACCEPTED_FILE_TYPES["video/*"].includes(resourceTypeFileFormat);

  return (
    <Draggable draggableId={resource.hashKey} index={index} disableInteractiveElementBlocking>
      {(provided) => (
        <GridItem
          h="full"
          minW="150px"
          p={2}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {isImage || isVideo ? (
            <AspectRatio bg="white" ratio={1} h="full" borderRadius="sm" overflow="hidden">
              {isVideo ? (
                <video key={resource.hashKey} title={resource.fileName} controls>
                  <source src={getImageThumb(resource, user?.id)} />
                </video>
              ) : (
                <Image {...imgThumb} />
              )}
            </AspectRatio>
          ) : (
            <AspectRatio bg="white" ratio={1} h="full" borderRadius="sm" overflow="hidden">
              <Box>
                <audio controls>
                  <source src={getImageThumb(resource, user?.id)} className="carousel--audio" />
                </audio>
              </Box>
            </AspectRatio>
          )}
        </GridItem>
      )}
    </Draggable>
  );
};
