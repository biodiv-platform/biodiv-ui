import { Box, Image, Link } from "@chakra-ui/react";
import { ResourceType } from "@interfaces/custom";
import { RESOURCE_SIZE } from "@static/constants";
import {
  getObservationImage,
  getObservationRAW,
  getLocalIcon,
  getYouTubeEmbed
} from "@utils/media";
import React from "react";

export const NoSlide = ({ speciesGroup }) => (
  <Box color="gray.500">
    <Image maxW="20rem" boxSize="full" src={getLocalIcon(speciesGroup)} />
  </Box>
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
    >
      {text}
    </Box>
  ) : null;

const Slide = ({ resource, alt }) => {
  switch (resource.type) {
    case ResourceType.Image:
      return (
        <Link target="_blank" href={getObservationRAW(resource.fileName)}>
          <Image
            className="carousel--image"
            loading="lazy"
            ignoreFallback={true}
            src={getObservationImage(resource.fileName, RESOURCE_SIZE.PREVIEW)}
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
          allowFullScreen={true}
        ></iframe>
      ) : (
        <video width="500" height="300" controls>
          <source src={getObservationRAW(resource.fileName)} />
        </video>
      );

    case ResourceType.Audio:
      return (
        <audio
          src={getObservationRAW(resource.fileName)}
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
