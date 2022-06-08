import { CloseIcon } from "@chakra-ui/icons";
import { AspectRatio, Box, IconButton, Image } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import useGlobalState from "@hooks/use-global-state";
import { getFallbackByMIME } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

import useObservationCreateNext from "../../use-observation-create-next-hook";
import ResourceNavigation from "./resource-navigation";

export default function Resources({ index, removeObservation }) {
  const { licensesList } = useObservationCreateNext();
  const { t } = useTranslation();
  const resources = useFieldArray({ name: `o.${index}.resources` });

  const { user } = useGlobalState();
  const [resourceIndex, setResourceIndex] = useState(0);

  const handleOnRemoveObservation = () => removeObservation(index);

  const handleOnRemoveResource = () => resources.remove(resourceIndex);

  return (
    <>
      <Box position="relative" key={resources.fields[resourceIndex].id}>
        <AspectRatio maxW="100%" mb={2} ratio={1}>
          <Image
            borderRadius="sm"
            objectFit="cover"
            overflow="hidden"
            className="o-selectable"
            src={getImageThumb(resources.fields[resourceIndex], user?.id)}
            fallbackSrc={getFallbackByMIME(resources.fields[resourceIndex]?.["type"])}
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
          setIndex={setResourceIndex}
          size={resources.fields.length}
        />
      </Box>
      <SelectInputField
        mb={2}
        key={index + resourceIndex}
        name={`o.${index}.resources.${resourceIndex}.licenseId`}
        options={licensesList}
        placeholder={t("observation:license")}
        shouldPortal={true}
      />
    </>
  );
}
