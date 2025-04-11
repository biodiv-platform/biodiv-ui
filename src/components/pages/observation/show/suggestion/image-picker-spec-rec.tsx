import { AspectRatio, Box, Flex, Image, useCheckbox } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import React from "react";

import { toaster } from "@/components/ui/toaster";

const ImagePickerSpecRec = (props: any) => {
  const { getControlProps, getLabelProps, setChecked, checked } = useCheckbox(props);

  const handleOnChange = (e) => {
    if (props.selectedImages.length >= 1 && e.target.checked) {
      toaster.create({
        title: "Please select a maximum of 1 image",
        type: "error",
        // isClosable: true,
        placement: "top"
      });

      return;
    }

    if (e.target.checked) {
      props.setter([...props.selectedImages, props.image]);
    } else {
      props.setter([
        ...props.selectedImages.filter((o) => o?.resource?.id !== props.image.resource.id)
      ]);

      setChecked(false);
    }
  };

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
    </Box>
  );
};

export default ImagePickerSpecRec;
