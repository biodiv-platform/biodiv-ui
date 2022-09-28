import { CloseIcon } from "@chakra-ui/icons";
import { AspectRatio, Box, IconButton, Image, useBoolean } from "@chakra-ui/react";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import useGlobalState from "@hooks/use-global-state";
import { AssetStatus } from "@interfaces/custom";
import { getFallbackByMIME } from "@utils/media";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import ManageResourcesModal from "../../manage-resources";
import useObservationCreateNext from "../../use-observation-create-next-hook";
import ResourceNavigation from "./resource-navigation";
import ResourceUploadIndicator from "./upload-indicator";

export default function Resources({ index, removeObservation }) {
  const resourcesName = `o.${index}.resources`;
  const resources = useFieldArray({ name: resourcesName });
  const [resourceEditor, setResourceEditor] = useBoolean();
  const { media } = useObservationCreateNext();
  const hForm = useFormContext();

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

  const resourceArrayValues = useWatch({ name: resourcesName });

  // This will update upload status
  useEffect(() => {
    resourceArrayValues.forEach((r, idx) => {
      const _status = media.status[r.hashKey];
      if (_status && r.status !== _status) {
        hForm.setValue(`${resourcesName}.${idx}.status`, _status);
      }
    });
  }, [media.status]);

  const uploadStats = useMemo(() => {
    const _total = resources.fields.length;
    const _uploaded = resourceArrayValues
      .map((r) => r.status)
      .filter((s) => s === AssetStatus.Uploaded).length;
    return { children: `${_uploaded}/${_total}`, hidden: _uploaded === _total };
  }, [resourceArrayValues]);

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
        <ResourceUploadIndicator {...uploadStats} />
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
