import { AspectRatio, Box, Flex, Image, useCheckbox, useToast } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import React, { useRef, useState } from "react";

const ImagePicker = (props: any) => {
  const { getInputProps, getCheckboxProps, state } = useCheckbox(props);
  const langRef: any = useRef(null);

  const toast = useToast();

  const [isOrganSelectionDisabled, setIsOrganSelectionDisabled] = useState(false);

  const handleOnChange = (e) => {
    if (props.selectedImages.length >= 5 && e.target.checked) {
      toast({
        title: "Please select a maximum of 5 images.",
        status: "error",
        isClosable: true,
        position: "top"
      });
      setIsOrganSelectionDisabled(true);

      //props.alertSetter(true);
      return;
    } else {
      setIsOrganSelectionDisabled(false);
      //props.alertSetter(false);
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
    //console.log("eeeeee=", e);
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
    { label: "leaf", value: "leaf" },
    { label: "flower", value: "flower" },
    { label: "fruit", value: "fruit" },
    { label: "bark", value: "bark" }
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

      <label id={props.image.resource.id}>
        {/* <Select
          options={organOptions}
          onChange={handleOrganSelect}
          isClearable={true}
          placeholder="select plant organ"
          menuPortalTarget={document.getElementById("")}
        /> */}

        <SelectInputField
          //id={props.image.resource.id}
          disabled={isOrganSelectionDisabled}
          name={props.image.resource.id.toString()}
          options={organOptions}
          onChangeCallback={handleOrganSelect}
          placeholder="select plant organ"
          shouldPortal={true}
          //isControlled={true}
          selectRef={langRef}
        />

        {/* <Select placeholder="Select plant organ">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select> */}
      </label>
    </Box>
  );
};

export default ImagePicker;
