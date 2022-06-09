import { CloseIcon } from "@chakra-ui/icons";
import { AspectRatio, Box, IconButton, Image, useBoolean } from "@chakra-ui/react";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import useGlobalState from "@hooks/use-global-state";
import { getFallbackByMIME } from "@utils/media";
import React, { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";

import ManageResourcesModal from "../../manage-resources";
import ResourceNavigation from "./resource-navigation";

export default function Resources({ index, removeObservation }) {
  const resources = useFieldArray({ name: `o.${index}.resources` });
  const [resourceEditor, setResourceEditor] = useBoolean();

  const { user } = useGlobalState();
  const [resourceIndex, setResourceIndex] = useState(0);

  const handleOnRemoveObservation = () => removeObservation(index);

  const handleOnRemoveResource = () => resources.remove(resourceIndex);

  const imgThumb = useMemo(
    () => ({
      key: resources.fields[resourceIndex].id,
      src: getImageThumb(resources.fields[resourceIndex], user?.id),
      fallbackSrc: getFallbackByMIME(resources.fields[resourceIndex]?.["type"])
    }),
    [resources.fields[resourceIndex].id]
  );

  return (
    <>
      <Box position="relative" key={imgThumb.key}>
        <AspectRatio maxW="100%" mb={2} ratio={1}>
          <Image
            borderRadius="sm"
            objectFit="cover"
            overflow="hidden"
            className="o-selectable"
            src={imgThumb.src}
            fallbackSrc={imgThumb.fallbackSrc}
          />
        </AspectRatio>
        <IconButton
          aria-label="Close"
          colorScheme="red"
          icon={<CloseIcon />}
          m={2}
          onClick={handleOnRemoveObservation}
          position="absolute"
          right="0"
          size="xs"
          top="0"
        />
        <ResourceNavigation
          index={resourceIndex}
          onDelete={handleOnRemoveResource}
          onReorder={setResourceEditor.on}
          setIndex={setResourceIndex}
          size={resources.fields.length}
        />
      </Box>
      {resourceEditor && (
        <ManageResourcesModal
          index={index}
          resources={resources}
          isOpen={resourceEditor}
          onClose={setResourceEditor.off}
        />
      )}
    </>
  );
}
