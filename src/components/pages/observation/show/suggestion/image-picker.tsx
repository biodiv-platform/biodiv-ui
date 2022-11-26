import { AspectRatio, Box, Flex, Image, useCheckbox } from "@chakra-ui/react";
import React from "react";

const ImagePicker = (props: any) => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  const handleOnChange = (e) => {
    if (e.target.checked) {
      props.setter([...props.selectedImages, props.image]);
    } else {
      props.setter([
        ...props.selectedImages.filter((o) => o?.resource?.id !== props.image.resource.id)
      ]);
    }
  };

  return (
    <Box as="label" className="fade" aria-checked={props.isChecked}>
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
            src={`https://venus.strandls.com/files-api/api/get/raw/observations/${props.image.resource.fileName}`}
            borderRadius="md"
            //fallbackSrc={getFallbackByMIME(props.asset.type)}
            //alt={props.asset.fileName}
          />
          {/* <ShadowedUser user={props.asset.userIbp} /> */}
        </Flex>
      </AspectRatio>
    </Box>
  );
};

export default ImagePicker;
