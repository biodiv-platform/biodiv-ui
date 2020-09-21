import { AspectRatio, IconButton, Image, VisuallyHidden } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/use-global-state";
import DeleteIcon from "@icons/delete";
import { getFallbackByMIME } from "@utils/media";
import React, { useMemo } from "react";

import { getImageThumb } from "../observation-resources/resource-card";
import StatusIcon from "../statusicon";
import useObservationCreate from "../use-observation-resources";

const ImageBox = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  .icon {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0.5rem;
  }

  .remove {
    position: absolute;
    margin: 0;
    top: 0;
    bottom: 0;
  }
`;

const Checkbox = ({ asset, ...props }) => {
  const { user } = useGlobalState();
  const { t } = useTranslation();

  const imageURL = useMemo(() => getImageThumb(asset, user.id), []);

  const { addToObservationAssets, removeObservationAsset, removeAsset } = useObservationCreate();

  const handleOnChange = (e) => {
    e.target.checked
      ? addToObservationAssets(asset.hashKey)
      : removeObservationAsset(asset.hashKey);
  };

  return (
    <label role="checkbox" className="custom-checkbox fade" aria-checked={props.isChecked}>
      <VisuallyHidden
        as="input"
        type="checkbox"
        {...props}
        checked={props.isChecked}
        onChange={handleOnChange}
        value={asset.hashKey}
      />
      <AspectRatio ratio={1}>
        <ImageBox>
          <IconButton
            className="remove fade"
            variant="ghost"
            colorScheme="red"
            hidden={props.isChecked}
            aria-label={t("DELETE")}
            onClick={() => removeAsset(asset)}
            icon={<DeleteIcon />}
          />
          <StatusIcon type={asset.status} />
          <Image
            borderRadius="md"
            style={{ filter: "none" }}
            boxSize="full"
            objectFit="cover"
            src={imageURL}
            fallbackSrc={getFallbackByMIME(asset.type)}
            alt={asset.fileName}
          />
        </ImageBox>
      </AspectRatio>
    </label>
  );
};

export default Checkbox;
