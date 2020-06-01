import { CloseButton, Flex, Image } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { AssetStatus, IDBObservationAsset } from "@interfaces/custom";
import { ASSET_TYPES, LOCAL_ASSET_PREFIX } from "@static/observation-create";
import {
  getFallbackByMIME,
  getMyUploadsThumbnail,
  getObservationThumbnail,
  getYoutubeImage
} from "@utils/media";
import { useStoreState } from "easy-peasy";
import React, { useMemo } from "react";

const ImageBox = styled.div`
  flex-grow: 1;
  margin-bottom: 0.5rem;
  position: relative;
  img {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  svg {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0.5rem;
  }
`;

interface IResourceCardProps {
  resource: IDBObservationAsset;
  index: number;
}

export const getImageThumb = (resource, userID, size = 140): string => {
  if (resource.status === AssetStatus.Uploaded) {
    return resource.type.match(ASSET_TYPES.VIDEO) && resource.url
      ? getYoutubeImage(resource.url)
      : resource.path.match(LOCAL_ASSET_PREFIX)
      ? getMyUploadsThumbnail(resource.path, userID, size)
      : getObservationThumbnail(resource.path);
  }
  return URL.createObjectURL(resource.blob || resource);
};

export default function ResourceCard({ resource, setValue }) {
  const { user } = useStoreState((s) => s);

  const imageURL = useMemo(() => getImageThumb(resource, user.id), []);

  const handleRemovePhoto = () => {
    setValue(null);
  };

  return (
    <Flex
      className="fade"
      minH="10rem"
      borderRadius="lg"
      bg="white"
      flexDir="column"
      border="1px solid"
      borderColor="gray.300"
      position="relative"
      p={2}
      key={resource.hashKey}
    >
      <ImageBox>
        <Image
          objectFit="cover"
          borderRadius="md"
          fallbackSrc={getFallbackByMIME(resource.type)}
          src={imageURL}
        />
      </ImageBox>
      <CloseButton
        position="absolute"
        top="200"
        right="200"
        size="lg"
        color="#FF0000"
        onClick={() => handleRemovePhoto()}
      />
    </Flex>
  );
}
