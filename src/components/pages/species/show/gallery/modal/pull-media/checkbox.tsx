import { AspectRatio, Box, Flex, Image, useCheckbox } from "@chakra-ui/react";
import ShadowedUser from "@components/pages/common/shadowed-user";
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

  const { getControlProps, getLabelProps } = useCheckbox(props);

  return (
    <Box as="label" className="fade" aria-checked={props.isChecked}>
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
            src={imageURL || getFallbackByMIME(props.asset.type)}
            borderRadius="md"
            alt={props.asset.fileName}
          />
          <ShadowedUser user={props.asset.userIbp} />
        </Flex>
      </AspectRatio>
    </Box>
  );
};

export default Checkbox;
