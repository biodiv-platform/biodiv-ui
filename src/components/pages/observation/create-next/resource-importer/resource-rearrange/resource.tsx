import { AspectRatio, GridItem } from "@chakra-ui/react";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import { Draggable } from "@hello-pangea/dnd";
import useGlobalState from "@hooks/use-global-state";
import { getFallbackByMIME } from "@utils/media";
import React, { useMemo } from "react";

import { FallbackImage } from "@/components/@core/fallback-image";

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
          minW="150px"
          p={2}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <AspectRatio bg="white" ratio={1} h="full" borderRadius="sm" overflow="hidden">
            <FallbackImage {...imgThumb} />
          </AspectRatio>
        </GridItem>
      )}
    </Draggable>
  );
};
