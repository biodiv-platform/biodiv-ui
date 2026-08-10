import { AspectRatio, Box, IconButton } from "@chakra-ui/react";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import useGlobalState from "@hooks/use-global-state";
import { AssetStatus } from "@interfaces/custom";
import { getFallbackByMIME } from "@utils/media";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { LuX } from "react-icons/lu";

import { ImageWithFallback } from "@/components/@core/image-with-fallback";

import ManageResourcesModal from "../../manage-resources";
import useObservationCreateNext from "../../use-observation-create-next-hook";
import ResourceNavigation from "./resource-navigation";
import ResourceUploadIndicator from "./upload-indicator";

export default function Resources({ index, removeObservation }) {
  const resourcesName = `o.${index}.resources`;
  const resources = useFieldArray({ name: resourcesName });
  const [resourceEditor, setResourceEditor] = useState(false);
  const { media, draft } = useObservationCreateNext();
  const hForm = useFormContext();

  const { user } = useGlobalState();
  const [resourceIndex, setResourceIndex] = useState(0);

  const handleOnRemoveObservation = () => removeObservation(index);

  const handleOnRemoveResource = () => resources.remove(resourceIndex);

  const currentResource = resources.fields[resourceIndex];

  const imgThumb = useMemo(
    () => ({
      key: currentResource?.id,
      src: currentResource ? getImageThumb(currentResource, user?.id) : "",
      fallbackSrc: getFallbackByMIME(currentResource?.["type"])
    }),
    [currentResource?.id, user?.id]
  );

  const resourceArrayValues = useWatch({ name: resourcesName }) || [];

  useEffect(() => {
    if (!resourceArrayValues.length) return;

    resourceArrayValues.forEach((r, idx) => {
      if (!r) return;

      const matchedDraft = draft.all?.find(
        (d) => d.hashKey === r.hashKey || (r.fileName && d.fileName === r.fileName)
      );

      if (matchedDraft) {
        if (matchedDraft.hashKey && matchedDraft.hashKey !== r.hashKey) {
          hForm.setValue(`${resourcesName}.${idx}.hashKey`, matchedDraft.hashKey);
        }
        if (matchedDraft.path && matchedDraft.path !== r.path) {
          hForm.setValue(`${resourcesName}.${idx}.path`, matchedDraft.path);
        }
        if (matchedDraft.status && r.status !== matchedDraft.status) {
          hForm.setValue(`${resourcesName}.${idx}.status`, matchedDraft.status);
        }
      } else {
        const _status = media.status[r.hashKey];
        if (_status && r.status !== _status) {
          hForm.setValue(`${resourcesName}.${idx}.status`, _status);
        }
      }
    });
  }, [media.status, draft.all, resourceArrayValues, resourcesName, hForm]);

  const uploadStats = useMemo(() => {
    const _resourceStatusList = resourceArrayValues.map((r) => r.status);

    const _total = resources.fields.length;
    const _uploaded = _resourceStatusList.filter((s) => s === AssetStatus.Uploaded).length;
    const _failed = _resourceStatusList.filter((s) => s === AssetStatus.Failed).length;

    const _progress = Math.round(
      resourceArrayValues.reduce((sum, r) => {
        if (r.status === AssetStatus.Uploaded || r.status === AssetStatus.Failed) {
          return sum + 100;
        }

        const currentProg = media.progress[r.hashKey];
        if (currentProg != null) {
          return sum + currentProg;
        }

        if (r.status === AssetStatus.InProgress) {
          return sum + 100;
        }

        return sum + 0;
      }, 0) / (_total || 1)
    );

    return {
      children: `${_uploaded}/${_total}`,
      hidden: _uploaded + _failed === _total,
      failed: _failed,
      progress: _progress
    };
  }, [resourceArrayValues, media.progress, resources.fields.length]);

  return (
    <>
      <Box position="relative" key={imgThumb.key}>
        <AspectRatio maxW="100%" mb={2} ratio={1}>
          <ImageWithFallback
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
          colorPalette="red"
          m={2}
          onClick={handleOnRemoveObservation}
          position="absolute"
          right="0"
          size="xs"
          top="0"
        >
          <LuX />
        </IconButton>
        <ResourceNavigation
          index={resourceIndex}
          onDelete={handleOnRemoveResource}
          onReorder={() => setResourceEditor(true)}
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
          onClose={() => setResourceEditor(false)}
        />
      )}
    </>
  );
}
