import { AspectRatio, Box, Flex, Image, useCheckbox } from "@chakra-ui/react";
import React from "react";
import Select from "react-select";

const ImagePicker = (props: any) => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  const handleOnChange = (e) => {
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
    }
  };

  const handleOrganSelect = (e) => {
    let obj = props.selectedOrgans.find((o, i) => {
      if (o.imageId === props.image.resource.id) {
        props.selectedOrgans[i] = { imageId: props.image.resource.id, organ: e ? e.value : "auto" };

        return true; // stop searching
      }
    });
    props.organSetter([...props.selectedOrgans]);
  };

  const organOptions = [
    { label: "leaf", value: "leaf" },
    { label: "flower", value: "flower" },
    { label: "fruit", value: "fruit" },
    { label: "bark", value: "bark" }
  ];

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
      {/* <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Organ
        </MenuButton>
        <MenuList defaultValue="auto">
          <MenuItem
            value="auto"
            onClick={handleOrganSelect}
            defaultChecked={true}
            _highlighted={{ color: "blue.500" }}
          >
            auto
          </MenuItem>
          <MenuItem value="leaf" onClick={handleOrganSelect}>
            leaf
          </MenuItem>
          <MenuItem value="flower" onClick={handleOrganSelect}>
            flower
          </MenuItem>
          <MenuItem value="fruit" onClick={handleOrganSelect}>
            fruit
          </MenuItem>
          <MenuItem value="bark" onClick={handleOrganSelect}>
            bark
          </MenuItem>
        </MenuList>
      </Menu> */}

      <label>
        <Select
          options={organOptions}
          onChange={handleOrganSelect}
          isClearable={true}
          placeholder="select plant organ"
        />
      </label>
    </Box>
  );
};

export default ImagePicker;
