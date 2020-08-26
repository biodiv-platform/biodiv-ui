import { AspectRatioBox, IconButton, Image, VisuallyHidden } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/useGlobalState";
import { getFallbackByMIME } from "@utils/media";
import React, { useMemo } from "react";

import { getImageThumb } from "../observation-resources/resource-card";
import StatusIcon from "../statusicon";
import useObservationCreate from "../use-observation-resources";

const VH: any = VisuallyHidden;

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
      <VH
        as="input"
        type="checkbox"
        {...props}
        checked={props.isChecked}
        onChange={handleOnChange}
        value={asset.hashKey}
      />
      <AspectRatioBox ratio={1}>
        <ImageBox>
          <IconButton
            className="remove fade"
            variant="ghost"
            variantColor="red"
            hidden={props.isChecked}
            aria-label={t("DELETE")}
            onClick={() => removeAsset(asset)}
            icon="delete"
          />
          <StatusIcon type={asset.status} />
          <Image
            borderRadius="md"
            style={{ filter: "none" }}
            size="full"
            objectFit="cover"
            src={imageURL}
            fallbackSrc={getFallbackByMIME(asset.type)}
            alt={asset.fileName}
          />
        </ImageBox>
      </AspectRatioBox>
    </label>
  );
};

export default Checkbox;
