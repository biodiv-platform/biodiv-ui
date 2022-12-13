import { AspectRatio, Box, Flex, Image, useCheckbox, useToast } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";

const ImagePicker = (props: any) => {
  const { getInputProps, getCheckboxProps, state } = useCheckbox(props);
  const langRef: any = useRef(null);

  const toast = useToast();

  const [isOrganSelectionDisabled, setIsOrganSelectionDisabled] = useState(false);
  const { t } = useTranslation();

  const handleOnChange = (e) => {
    if (props.selectedImages.length >= 5 && e.target.checked) {
      toast({
        title: t("observation:plantnet.please_select_a_maximum_of_5_images"),
        status: "error",
        isClosable: true,
        position: "top"
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
      state.isChecked = false;
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
    <Box as="label" className="fade" aria-checked={state.isChecked}>
      <input {...getInputProps()} onChange={handleOnChange} required={false} />
      <AspectRatio
        ratio={1}
        {...getCheckboxProps()}
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
