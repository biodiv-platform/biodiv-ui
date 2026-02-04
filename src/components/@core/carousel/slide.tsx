import { Box, Flex, Image, Link } from "@chakra-ui/react";
import { ResourceType } from "@interfaces/custom";
import { RESOURCE_SIZE } from "@static/constants";
import { getLocalIcon, getResourceRAW, getResourceThumbnail, getYouTubeEmbed } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import React from "react";

export const NoSlide = ({ speciesGroup }) => (
  <Flex color="gray.500" w="full" justifyContent="center" pt={10}>
    <Image maxW="20rem" src={getLocalIcon(speciesGroup)} />
  </Flex>
);

const SlideDescription = ({ text }) =>
  text ? (
    <Box
      position="absolute"
      w="100%"
      left={0}
      bottom={0}
      textAlign="center"
      p={4}
      background="linear-gradient(to bottom, rgba(25, 25, 35, 0), rgba(25, 25, 35, 1))"
      color="white"
      dangerouslySetInnerHTML={{ __html: getInjectableHTML(text) }}
    />
  ) : null;

const Slide = ({ resource, alt }) => {
  switch (resource.type) {
    case ResourceType.Icon:
    case ResourceType.Image:
      return (
        <Link target="_blank" href={getResourceRAW(resource.context, resource.fileName)}>
          <Image
            loading="lazy"
            src={getResourceThumbnail(resource.context, resource.fileName, RESOURCE_SIZE.PREVIEW)}
            alt={resource.description || alt || resource.fileName}
          />
          <SlideDescription text={resource.description} />
        </Link>
      );

    case ResourceType.Video:
      return resource.url ? (
        <iframe
          width="500"
          height="300"
          src={getYouTubeEmbed(resource.url)}
          frameBorder={0}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      ) : (
        <video width="500" height="300" controls>
          <source src={getResourceRAW(resource.context, resource.fileName)} />
        </video>
      );

    case ResourceType.Audio:
      return (
        <audio
          src={getResourceRAW(resource.context, resource.fileName)}
          preload="auto"
          controls={true}
          className="carousel--audio"
        ></audio>
      );

    default:
      return <div></div>;
  }
};

export default Slide;
