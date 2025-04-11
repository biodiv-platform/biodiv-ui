import { AspectRatio, Box, Flex, Image, useCheckbox } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";

import { toaster } from "@/components/ui/toaster";

const ImagePicker = (props: any) => {
  const { getControlProps, getLabelProps, setChecked, checked } = useCheckbox(props);
  const langRef: any = useRef(null);

  const [isOrganSelectionDisabled, setIsOrganSelectionDisabled] = useState(false);
  const { t } = useTranslation();

  const handleOnChange = (e) => {
    if (props.selectedImages.length >= 5 && e.target.checked) {
      toaster.create({
        title: t("observation:plantnet.please_select_a_maximum_of_5_images"),
        type: "error",
        // isClosable: true,
        placement: "top"
      });
      setIsOrganSelectionDisabled(true);
      return;
    } else {
      setIsOrganSelectionDisabled(false);
    }

    if (e.target.checked) {
      props.setter([...props.selectedImages, props.image]);
      props.organSetter([
        ...props.selectedOrgans,
        { imageId: props.image.resource.id, organ: "auto" }
      ]);
    } else {
      props.setter([
        ...props.selectedImages.filter((o) => o?.resource?.id !== props.image.resource.id)
      ]);
      props.organSetter([
        ...props.selectedOrgans.filter((o) => o?.imageId !== props.image.resource.id)
      ]);
      setChecked(false);
    }
  };

  const handleOrganSelect = (e) => {
    props.selectedOrgans.find((o, i) => {
      if (o.imageId === props.image.resource.id) {
        props.selectedOrgans[i] = {
          imageId: props.image.resource.id,
          organ: e ? e : "auto"
        };

        return true; // stop searching
      }
    });
    props.organSetter([...props.selectedOrgans]);
  };

  const organOptions = [
    { label: `${t("observation:plantnet.organ_options.leaf")}`, value: "leaf" },
    { label: `${t("observation:plantnet.organ_options.flower")}`, value: "flower" },
    { label: `${t("observation:plantnet.organ_options.fruit")}`, value: "fruit" },
    { label: `${t("observation:plantnet.organ_options.bark")}`, value: "bark" }
  ];

  return (
    <Box as="label" className="fade" aria-checked={checked}>
      <input {...getControlProps()} onChange={handleOnChange} required={false} />
      <AspectRatio
        ratio={1}
        {...getLabelProps()}
        borderRadius="lg"
        overflow="hidden"
        borderWidth="2px"
        bg="white"
        _checked={{ borderColor: "blue.500", bg: "blue.50" }}
        style={undefined}
      >
        <Flex cursor="pointer" position="relative" p={2}>
          <Image
            style={{ filter: "none" }}
            boxSize="full"
            objectFit="cover"
            src={`${SITE_CONFIG.SITE.URL}/files-api/api/get/raw/observations/${props.image.resource.fileName}`}
            borderRadius="md"
          />
        </Flex>
      </AspectRatio>

      <label id={props.image.resource.id}>
        <SelectInputField
          disabled={isOrganSelectionDisabled}
          name={props.image.resource.id.toString()}
          options={organOptions}
          onChangeCallback={handleOrganSelect}
          placeholder={t("observation:plantnet.select_plant_organ")}
          shouldPortal={true}
          selectRef={langRef}
        />
      </label>
    </Box>
  );
};

export default ImagePicker;
