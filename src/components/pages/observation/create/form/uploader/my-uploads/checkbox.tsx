import { AspectRatio, Box, IconButton, Image, useCheckbox } from "@chakra-ui/react";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import DeleteIcon from "@icons/delete";
import { getFallbackByMIME } from "@utils/media";
import React, { useMemo } from "react";

import { getImageThumb } from "../observation-resources/resource-card";
import StatusIcon from "../statusicon";
import useObservationCreate from "../use-observation-resources";

const ImageBox = styled.div`
  cursor: pointer;
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 0.4rem;

  .icon {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0.7rem;
  }

  .remove {
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
  }
`;

const Checkbox = (props: any) => {
  const { user } = useGlobalState();
  const { t } = useTranslation();

  const imageURL = useMemo(() => getImageThumb(props.asset, user.id), []);

  const { addToObservationAssets, removeObservationAsset, removeAsset } = useObservationCreate();

  const handleOnChange = (e) => {
    e.target.checked
      ? addToObservationAssets(props.asset.hashKey)
      : removeObservationAsset(props.asset.hashKey);
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
        <ImageBox>
          <IconButton
            className="remove fade"
            variant="ghost"
            colorScheme="red"
            hidden={props.isChecked}
            aria-label={t("DELETE")}
            onClick={() => removeAsset(props.asset)}
            icon={<DeleteIcon />}
          />
          <StatusIcon type={props.asset.status} />
          <Image
            style={{ filter: "none" }}
            boxSize="full"
            objectFit="cover"
            src={imageURL}
            borderRadius="md"
            fallbackSrc={getFallbackByMIME(props.asset.type)}
            alt={props.asset.fileName}
          />
        </ImageBox>
      </AspectRatio>
    </Box>
  );
};

export default Checkbox;
