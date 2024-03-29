import { CloseButton, Flex, Image, Input } from "@chakra-ui/react";
import Rating from "@components/@core/rating";
import { selectStyles } from "@components/form/configs";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/use-global-state";
import StarIcon from "@icons/star";
import StarOutlineIcon from "@icons/star-outline";
import { AssetStatus, IDBObservationAsset } from "@interfaces/custom";
import { MENU_PORTAL_TARGET, RESOURCE_SIZE } from "@static/constants";
import { ASSET_TYPES, LOCAL_ASSET_PREFIX } from "@static/observation-create";
import {
  getFallbackByMIME,
  getResourceThumbnail,
  getYoutubeImage,
  RESOURCE_CTX
} from "@utils/media";
import React, { useMemo } from "react";
import Select from "react-select";

import StatusIcon from "../statusicon";
import useObservationCreate from "../use-observation-resources";

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

export const getImageThumb = (resource, userID) => {
  if (!resource) return;

  if (resource.blobURL) return resource.blobURL;

  if (resource.status === AssetStatus.Uploaded) {
    return resource.type.match(ASSET_TYPES.VIDEO) && resource.url
      ? getYoutubeImage(resource.url)
      : resource.path.match(LOCAL_ASSET_PREFIX)
      ? getResourceThumbnail(
          RESOURCE_CTX.MY_UPLOADS,
          userID + resource.path,
          RESOURCE_SIZE.RECENT_THUMBNAIL
        ) // MyUploads
      : getResourceThumbnail(resource.context, resource.path, RESOURCE_SIZE.DEFAULT);
  }

  try {
    if (resource.type.match(ASSET_TYPES.IMAGE) && resource.blob) {
      return window.URL.createObjectURL(resource.blob);
    }
  } catch (e) {
    console.error(e);
  }

  return undefined;
};

export default function ResourceCard({ resource, index }: IResourceCardProps) {
  const { removeObservationAsset, updateObservationAsset, licensesList } = useObservationCreate();
  const { user } = useGlobalState();

  const imageURL = useMemo(() => getImageThumb(resource, user?.id), []);

  return (
    <Flex
      className="fade"
      minH="25rem"
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
        <StatusIcon type={resource.status} />
      </ImageBox>
      <CloseButton
        position="absolute"
        top="0"
        right="0"
        size="sm"
        m={4}
        bg="red.500"
        _hover={{ bg: "red.500" }}
        color="white"
        onClick={() => removeObservationAsset(resource.hashKey)}
      />
      <Flex direction="column" flexShrink={0}>
        <Select
          defaultValue={licensesList.find((l) => l.value === resource.licenseId)}
          menuPortalTarget={MENU_PORTAL_TARGET}
          options={licensesList}
          name={`opt-${resource.id}`}
          inputId={`opt-${resource.id}`}
          styles={selectStyles}
          onChange={(v) => updateObservationAsset(index, resource.hashKey, "licenseId", v.value)}
        />
        <Input
          placeholder="Contributor"
          mt={2}
          name={`contributor-${resource.id}`}
          defaultValue={resource.contributor}
          onBlur={(e) =>
            updateObservationAsset(index, resource.hashKey, "contributor", e?.target?.value)
          }
        />
        <Input
          placeholder="Caption"
          my={2}
          name={`caption-${resource.id}`}
          defaultValue={resource.caption}
          onBlur={(e) =>
            updateObservationAsset(index, resource.hashKey, "caption", e?.target?.value)
          }
        />
        <Flex justify="center" fontSize="1.5rem" lineHeight="1rem">
          <Rating
            initialRating={resource.rating}
            onChange={(v) => updateObservationAsset(index, resource.hashKey, "rating", v)}
            emptySymbol={<StarOutlineIcon />}
            fullSymbol={<StarIcon />}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
