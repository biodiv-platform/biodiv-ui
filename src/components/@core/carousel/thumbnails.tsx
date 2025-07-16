import { Flex, HStack, Image } from "@chakra-ui/react";
import AudioIcon from "@icons/audio";
import VideoIcon from "@icons/video";
import { ResourceType } from "@interfaces/custom";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, getYoutubeImage } from "@utils/media";
import React from "react";

const Thumbnail = ({ resource }) => {
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
        <VideoIcon />
      );

    case ResourceType.Audio:
      return <AudioIcon />;

    default:
      return <>_</>;
  }
};

function Thumbnails({ resources, moveTo, current }) {
  return (
    <HStack justifyContent="center" gap={2} mt={2} maxW="full" overflowY="auto">
      {resources.map(({ resource }, index) => (
        <Flex
          cursor="pointer"
          transition="all 250ms"
          boxSize="2.5rem"
          minW="2.5rem"
          border="2px"
          borderRadius="md"
          borderColor="transparent"
          bg="gray.300"
          key={resource.id}
          onClick={() => moveTo(index)}
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          opacity={index === current ? 1 : 0.7}
          _hover={{ opacity: 1 }}
        >
          <Thumbnail resource={resource} />
        </Flex>
      ))}
    </HStack>
  );
}

export default Thumbnails;
