import { AspectRatio, Box, Flex, Image, useCheckbox } from "@chakra-ui/react";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import useGlobalState from "@hooks/use-global-state";
import { getFallbackByMIME } from "@utils/media";
import React, { useMemo } from "react";

const Checkbox = (props: any) => {
  const { user } = useGlobalState();

  const imageURL = useMemo(() => getImageThumb(props.asset, user?.id), []);

  const { setObservationAssets } = useObservationCreate();

  const handleOnChange = (e) => {
    setObservationAssets((_draft) => {
      if (e.target.checked) {
        _draft.a.push(props.asset);
      } else {
        _draft.a = _draft.a.filter((o) => o.id !== props.asset.id);
      }
    });
  };

  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  return (
    <Box as="label" className="fade" aria-checked={props.isChecked}>
      <input {...getInputProps()} onChange={handleOnChange} />
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
        <Flex cursor="pointer" p={2}>
          <Image
            style={{ filter: "none" }}
            boxSize="full"
            objectFit="cover"
            src={imageURL}
            borderRadius="md"
            fallbackSrc={getFallbackByMIME(props.asset.type)}
            alt={props.asset.fileName}
          />
        </Flex>
      </AspectRatio>
    </Box>
  );
};

export default Checkbox;
