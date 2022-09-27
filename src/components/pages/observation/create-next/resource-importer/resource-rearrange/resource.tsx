import { AspectRatio, GridItem, Image } from "@chakra-ui/react";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import useGlobalState from "@hooks/use-global-state";
import { getFallbackByMIME } from "@utils/media";
import React, { useMemo } from "react";
import { Draggable } from "react-beautiful-dnd";

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

  return (
    <Draggable draggableId={resource.hashKey} index={index}>
      {(provided) => (
        <GridItem
          h="full"
          p={2}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <AspectRatio bg="white" ratio={1} h="full" borderRadius="md">
            <Image {...imgThumb} borderRadius="md" />
          </AspectRatio>
        </GridItem>
      )}
    </Draggable>
  );
};
