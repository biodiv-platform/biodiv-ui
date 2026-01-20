import { Box, Image } from "@chakra-ui/react";
import AudioIcon from "@icons/audio";
import VideoIcon from "@icons/video";
import { ResourceType } from "@interfaces/custom";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, getYoutubeImage } from "@utils/media";
import React from "react";

export const Thumbnail = ({ resource }) => {
  switch (resource.type) {
    case ResourceType.Icon:
    case ResourceType.Image:
      return (
        <Image
          boxSize="100%"
          loading="lazy"
          objectFit="cover"
          alt={resource.description || resource.fileName}
          src={getResourceThumbnail(resource.context, resource.fileName, RESOURCE_SIZE.THUMBNAIL)}
        />
      );

    case ResourceType.Video:
      return resource?.url ? (
        <Image
          boxSize="100%"
          loading="lazy"
          objectFit="cover"
          alt={resource.description || resource.fileName}
          src={getYoutubeImage(resource.url, "default")}
        />
      ) : (
        <Box boxSize="100%" display="flex" alignItems="center" justifyContent="center">
          <VideoIcon />
        </Box>
      );

    case ResourceType.Audio:
      return (
        <Box boxSize="100%" display="flex" alignItems="center" justifyContent="center">
          <AudioIcon />;
        </Box>
      );

    default:
      return <>_</>;
  }
};
